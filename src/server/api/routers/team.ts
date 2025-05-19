import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { UTApi } from "uploadthing/server";
export const utapi = new UTApi();

export const teamRouter = createTRPCRouter({
  getDisplay: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.team.findMany({
      orderBy: { createdAt: "desc" },
      include: { image: { take: 1, orderBy: { updatedAt: "desc" } } },
    });
  }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        name: z.string().min(1),
        role: z.string().min(1),
        activated: z.boolean().default(true),
        weight: z.number().default(0),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user?.isAdmin)
        throw new TRPCError({ code: "UNAUTHORIZED" });

      return await ctx.db.team.create({
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
            title: z.string().optional(),
            name: z.string().optional(),
            role: z.string().optional(),
            activated: z.boolean().optional(),
            weight: z.number().optional(),
          }),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.session.user?.isAdmin)
        throw new TRPCError({ code: "UNAUTHORIZED" });

      if (input?.search) {
        return await ctx.db.team.findMany({
          where: {
            ...input.search,
          },
          take: 10,
          orderBy: { createdAt: "desc" },
        });
      }
      return await ctx.db.team.findMany({
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
      return await ctx.db.team.update({
        where: { id: input.id },
        data: { activated: !input.activated },
      });
    }),
  updateById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).optional(),
        name: z.string().min(1).optional(),
        role: z.string().optional(),
        activated: z.boolean().optional(),
        weight: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user?.isAdmin)
        throw new TRPCError({ code: "UNAUTHORIZED" });
      return await ctx.db.team.update({
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
      return await ctx.db.team.findFirst({
        where: { id },
        include: { image: true },
      });
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user?.isAdmin)
        throw new TRPCError({ code: "UNAUTHORIZED" });

      const images = await ctx.db.image.findMany({
        where: { teamId: input },
        select: { key: true },
      });

      void utapi.deleteFiles(images.map(({ key }) => key));

      return await ctx.db.team.delete({
        where: { id: input },
        include: { image: true },
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
      if (!ctx.session.user?.isAdmin)
        throw new TRPCError({ code: "UNAUTHORIZED" });
      return await ctx.db.team.update({
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
