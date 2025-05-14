import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
export const departmentRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ code: z.string().optional(), label: z.string().min(2) }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user?.isAdmin) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      return await ctx.db.department.create({
        data: {
          ...input,
          code:
            !input.code || input.code.length <= 0
              ? input.label
                  .replace(/[^\x00-\x7F]/g, "")
                  .replace(/[^a-zA-Z0-9\s]/g, "")
                  .replace(/\s+/g, "_")
                  .toLowerCase()
              : input.code,
        },
      });
    }),

  get: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session.user?.isAdmin) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return await ctx.db.department.findMany();
  }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user?.isAdmin) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      return await ctx.db.department.delete({ where: { id: input } });
    }),

  updateById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        code: z.string().optional(),
        label: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user?.isAdmin) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      return await ctx.db.department.update({
        where: { id: input.id },
        data: {
          ...input,
          code:
            !input.code || input.code.length <= 0
              ? input.label
                  .replace(/[^\x00-\x7F]/g, "")
                  .replace(/[^a-zA-Z0-9\s]/g, "")
                  .replace(/\s+/g, "_")
                  .toLowerCase()
              : input.code,
        },
      });
    }),
  switchDepartment: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        departmentId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user?.isAdmin) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const departmentAction = input.departmentId
        ? { connect: { id: input.departmentId } }
        : { disconnect: { id: input.departmentId } };

      return await ctx.db.user.update({
        where: { id: input.userId },
        data: {
          Department: departmentAction,
        },
      });
    }),
  getById: protectedProcedure
    .input(z.object({ id: z.string().optional() }))
    .query(async ({ ctx, input: { id } }) => {
      if (!ctx.session.user?.isAdmin) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      if (!id) {
        return null;
      }
      return await ctx.db.department.findFirst({
        where: { id: id },
      });
    }),
});
