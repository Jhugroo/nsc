import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { UTApi } from "uploadthing/server";
export const utapi = new UTApi();

const isUserAllowed = (
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } & {
    id: string;
    location: string;
    isAdmin: boolean;
    isVerified: boolean;
    locations: { id: number; code: string; label: string }[];
    departmentId: string;
  },
  departmentId: string | undefined | null,
) => {
  if (user.isAdmin) return true;
  if (user.isVerified && (user.departmentId === departmentId || !departmentId))
    return true;
  throw new TRPCError({ code: "UNAUTHORIZED" });
};

export const departmentPageRouter = createTRPCRouter({
  getDisplay: publicProcedure
    .input(
      z
        .object({
          take: z.number().default(50),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.departmentPage.findMany({
        where: { activated: true },
        take: !input ? 50 : input.take > 50 ? 50 : input.take,
        orderBy: { createdAt: "desc" },
        include: { image: true, Department: { select: { label: true } } },
      });
    }),
  getDisplayDepartmentPage: publicProcedure
    .input(z.string().optional())
    .query(async ({ ctx, input }) => {
      return await ctx.db.departmentPage.findFirst({
        where: { id: input },
        include: {
          image: true,
          Department: { select: { label: true, id: true } },
        },
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
      isUserAllowed(ctx.session.user, input.departmentId);
      const { departmentId: _, ...filteredInput } = input;
      return await ctx.db.departmentPage.create({
        data: {
          ...filteredInput,
          Department: {
            connect: {
              id: input.departmentId ?? ctx.session.user.departmentId,
            },
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
            title: z.string().min(1).optional(),
            eventDate: z.number().optional(),
            description: z.string().optional(),
            link: z.string().optional(),
            departmentId: z.string().optional(),
          }),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      isUserAllowed(ctx.session.user, input?.search.departmentId);
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
  switchActive: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        departmentId: z.string(),
        activated: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      isUserAllowed(ctx.session.user, input.departmentId);
      await ctx.db.departmentPage.updateMany({
        where: { departmentId: input.departmentId },
        data: { activated: false },
      });
      return await ctx.db.departmentPage.update({
        where: { id: input.id },
        data: { activated: !input.activated },
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
      isUserAllowed(ctx.session.user, input.departmentId);
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
      const departmentId = await ctx.db.departmentPage.findFirst({
        where: { id: input },
        select: { departmentId: true },
      });

      isUserAllowed(ctx.session.user, departmentId?.departmentId);

      const images = await ctx.db.image.findMany({
        where: { departmentPageId: input },
        select: { key: true },
      });

      void utapi.deleteFiles(images.map(({ key }) => key));

      return await ctx.db.departmentPage.delete({
        where: { id: input },
        include: { image: true },
      });
    }),
  deleteImage: protectedProcedure
    .input(z.object({ id: z.string(), key: z.string() }))
    .mutation(async ({ ctx, input: { id, key } }) => {
      const departmentId = await ctx.db.image.findFirst({
        where: { id },
        select: { DepartmentPage: { select: { departmentId: true } } },
      });
      isUserAllowed(
        ctx.session.user,
        departmentId?.DepartmentPage?.departmentId,
      );

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
      const departmentId = await ctx.db.departmentPage.findFirst({
        where: { id },
        select: { departmentId: true },
      });
      isUserAllowed(ctx.session.user, departmentId?.departmentId);
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
