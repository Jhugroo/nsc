import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { UTApi } from "uploadthing/server";
export const utapi = new UTApi();
export const departmentPageRouter = createTRPCRouter({
  getDisplayDepartmentPages: publicProcedure
    .input(
      z
        .object({
          take: z.number().default(50),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);

      return await ctx.db.departmentPage.findMany({
        take: !input ? 50 : input.take > 50 ? 50 : input.take,
        orderBy: { createdAt: "desc" },
        include: { image: true, Department: { select: { label: true } } },
      });
    }),
  getDisplayDepartmentPage: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.db.departmentPage.findFirst({
        where: { id: input },
        include: { image: true, Department: { select: { label: true } } },
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string(),
        link: z.string().optional(),
        departmentId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user?.isVerified)
        throw new TRPCError({ code: "UNAUTHORIZED" });
      const user = ctx.session.user;

      return await ctx.db.departmentPage.create({
        data: {
          title: input.title,
          description: input.description,
          link: input.link,
          Department: {
            connect: { id: input.departmentId ?? user.departmentId },
          },
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
            title: z.string().min(1),
            eventDate: z.number(),
            description: z.string(),
            link: z.string().optional(),
            departmentId: z.string().optional(),
          }),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const forceSearchByDepartmentIfNotAdmin = ctx.session.user?.isAdmin ===
        false && {
        departmentId: ctx.session.user?.departmentId ?? undefined,
      };
      if (!ctx.session.user?.isAdmin && !ctx.session.user?.departmentId) {
        return [];
      }
      if (input?.search) {
        return await ctx.db.departmentPage.findMany({
          where: {
            ...input.search,
            ...forceSearchByDepartmentIfNotAdmin,
          },
          take: 10,
          orderBy: { createdAt: "desc" },
        });
      }
      return await ctx.db.departmentPage.findMany({
        where: { ...forceSearchByDepartmentIfNotAdmin },
        orderBy: { createdAt: "desc" },
      });
    }),

  updateById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1),
        description: z.string(),
        link: z.string().optional(),
        departmentId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user?.isVerified)
        throw new TRPCError({ code: "UNAUTHORIZED" });

      return await ctx.db.departmentPage.update({
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
      return await ctx.db.departmentPage.findFirst({
        where: { id },
        include: { image: true },
      });
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user?.isVerified) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const images = await ctx.db.image.findMany({
        where: { departmentPageId: input },
        select: { key: true },
      });

      images.map(({ key }) => void utapi.deleteFiles(key));

      return await ctx.db.departmentPage.delete({
        where: { id: input },
        include: { image: true },
      });
    }),
  deleteImage: protectedProcedure
    .input(z.object({ id: z.string(), key: z.string() }))
    .mutation(async ({ ctx, input: { id, key } }) => {
      if (!ctx.session.user?.isVerified)
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
