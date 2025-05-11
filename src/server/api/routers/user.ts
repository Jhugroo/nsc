import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
export const userRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.string().optional())
    .query(async ({ ctx, input }) => {
      if (!input) {
        return await ctx.db.user.findFirst({
          where: { id: ctx.session.user.id },
        });
      }
      return await ctx.db.user.findFirst({ where: { id: input } });
    }),

  getUsers: protectedProcedure
    .input(
      z
        .object({
          verificationRequested: z.boolean().optional(),
          skip: z.number().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.session.user?.isAdmin) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const isNextNull = await ctx.db.user.findFirst({
        skip: (input?.skip ?? 0) + 50,
        where: { verificationRequested: input?.verificationRequested },
        select: {
          id: true,
        },
      });
      const users = await ctx.db.user.findMany({
        take: 50,
        skip: input?.skip,
        where: { verificationRequested: input?.verificationRequested },
        select: {
          id: true,
          name: true,
          isAdmin: true,
          isVerified: true,
          phone: true,
          email: true,
          emailVerified: true,
          Department: { select: { label: true, id: true } },
        },
      });
      return { users: users, isNextNull: isNextNull };
    }),

  userStatus: protectedProcedure
    .input(
      z
        .object({
          id: z.string(),
          current: z.boolean(),
          status: z.string(),
        })
        .optional(),
    )
    .mutation(async ({ ctx, input }) => {
      if (!input) {
        return ctx.db.user.update({
          where: { id: ctx.session.user.id },
          data: {
            verificationRequested: true,
          },
        });
      }
      return ctx.db.user.update({
        where: { id: input.id },
        data: {
          [input.status]: !input.current,
          verificationRequested: false,
        },
      });
    }),

  updateUserData: protectedProcedure
    .input(
      z.object({
        phone: z.string().min(1),
        name: z.string().min(1),
        id: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!input.id) {
        return null;
      }
      return await ctx.db.user.update({
        where: { id: input.id },
        data: {
          phone: input.phone,
          name: input.name.trim(),
        },
      });
    }),
});
