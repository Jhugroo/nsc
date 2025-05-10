import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
export const locationRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ code: z.string().min(1), label: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user?.isAdmin) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }
      return await ctx.db.location.create({
        data: {
          ...input,
        },
      });
    }),

  get: protectedProcedure
    .query(async ({ ctx }) => {
      if (!ctx.session.user?.isAdmin) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }
      return await ctx.db.location.findMany();
    }),

  delete: protectedProcedure.input(z.number())
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user?.isAdmin) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }
      return await ctx.db.location.delete({ where: { id: input } })
    }),

  updateById: protectedProcedure
    .input(z.object({ id: z.number(), code: z.string().min(1), label: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user?.isAdmin) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }
      return await ctx.db.location.update({
        where: { id: input.id },
        data: {
          ...input
        },
      });
    }),

  getById: protectedProcedure.input(z.object({ id: z.number().optional() }))
    .query(async ({ ctx, input: { id } }) => {
      if (!ctx.session.user?.isAdmin) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }
      if (!id) {
        return null;
      }
      return await ctx.db.location.findFirst({
        where: { id: id },
      });
    }),

});
