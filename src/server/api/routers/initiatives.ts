import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { UTApi } from "uploadthing/server";
export const utapi = new UTApi();

export const initiativesRouter = createTRPCRouter({
  getDisplay: publicProcedure.query(
    async ({ ctx }) =>
      await ctx.db.initiatives.findMany({
        where: { activated: true },
        orderBy: { weight: "desc" },
      }),
  ),
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        icon: z.string().min(1),
        description: z.string(),
        iconColor: z.string(),
        weight: z.number().default(0),
        activated: z.boolean().default(true),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user?.isAdmin)
        throw new TRPCError({ code: "UNAUTHORIZED" });

      return await ctx.db.initiatives.create({
        data: {
          ...input,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),
  get: protectedProcedure
    .input(
      z
        .object({
          search: z.object({
            id: z.string().optional(),
            title: z.string().min(1).optional(),
            icon: z.string().min(1).optional(),
            description: z.string().optional(),
            weight: z.number().optional(),
            activated: z.boolean().optional(),
          }),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.session.user?.isAdmin)
        throw new TRPCError({ code: "UNAUTHORIZED" });
      if (input?.search) {
        return await ctx.db.initiatives.findMany({
          where: {
            ...input.search,
          },
          take: 10,
          orderBy: { createdAt: "desc" },
        });
      }
      return await ctx.db.initiatives.findMany({
        orderBy: { createdAt: "desc" },
      });
    }),
  switchActive: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        activated: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user?.isAdmin)
        throw new TRPCError({ code: "UNAUTHORIZED" });
      return await ctx.db.initiatives.update({
        where: { id: input.id },
        data: { activated: !input.activated },
      });
    }),
  updateById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1),
        icon: z.string().min(1),
        iconColor: z.string(),
        description: z.string(),
        weight: z.number(),
        activated: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user?.isAdmin)
        throw new TRPCError({ code: "UNAUTHORIZED" });
      return await ctx.db.initiatives.update({
        where: { id: input.id },
        data: {
          ...input,
        },
      });
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string().optional() }))
    .query(async ({ ctx, input: { id } }) => {
      if (!id) {
        return null;
      }
      return await ctx.db.initiatives.findFirst({
        where: { id },
      });
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user?.isAdmin)
        throw new TRPCError({ code: "UNAUTHORIZED" });

      return await ctx.db.initiatives.delete({
        where: { id: input },
      });
    }),
  deleteImage: protectedProcedure
    .input(z.object({ id: z.string(), key: z.string() }))
    .mutation(async ({ ctx, input: { id, key } }) => {
      if (!ctx.session.user?.isAdmin)
        throw new TRPCError({ code: "UNAUTHORIZED" });

      void utapi.deleteFiles(key);
      return ctx.db.image.delete({ where: { id: id } });
    }),
  addImage: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        files: z.array(
          z.object({
            key: z.string(),
            name: z.string(),
            type: z.string(),
            url: z.string(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input: { id, files } }) => {
      if (!ctx.session.user?.isVerified)
        throw new TRPCError({ code: "UNAUTHORIZED" });

      return await ctx.db.departmentPage.update({
        where: { id: id },
        data: {
          image: {
            createMany: {
              data: files.map((file) => {
                return { ...file, createdById: ctx.session.user.id };
              }),
            },
          },
        },
      });
    }),
});
