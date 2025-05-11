import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { UTApi } from "uploadthing/server";
export const utapi = new UTApi();
export const eventRouter = createTRPCRouter({
  getDisplayEvents: publicProcedure
    .input(
      z
        .object({
          take: z.number().default(50),
          departmentId: z.string().optional(),
          showLegacy: z.boolean().default(false).optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      console.log("LEGACY" + input?.showLegacy);
      const dateConstraint =
        input?.showLegacy === true
          ? undefined
          : {
              eventDate: { gte: startDate },
            };
      console.log(input?.showLegacy);
      return await ctx.db.event.findMany({
        where: {
          departmentId: input?.departmentId,
          ...dateConstraint,
        },
        take: !input ? 50 : input.take > 50 ? 50 : input.take,
        orderBy: { eventDate: "desc" },
        include: { image: true },
      });
    }),
  getDisplayEvent: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.db.event.findFirst({
        where: { id: input },
        include: { image: true },
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        eventDate: z.number(),
        description: z.string(),
        location: z.string(),
        link: z.string().optional(),
        departmentId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user?.isAdmin)
        throw new TRPCError({ code: "UNAUTHORIZED" });
      const { departmentId: _, ...filteredInput } = input;
      return await ctx.db.event.create({
        data: {
          ...filteredInput,
          eventDate: new Date(input.eventDate),
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
            title: z.string().min(1),
            eventDate: z.number(),
            description: z.string(),
            location: z.string(),
            link: z.string().optional(),
          }),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.session.user?.isAdmin)
        throw new TRPCError({ code: "UNAUTHORIZED" });
      if (input?.search) {
        return await ctx.db.event.findMany({
          where: {
            ...input.search,
            eventDate: new Date(input.search.eventDate),
          },
          take: 10,
          orderBy: { eventDate: "desc" },
        });
      }
      return await ctx.db.event.findMany({
        orderBy: { eventDate: "desc" },
      });
    }),

  updateById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1),
        eventDate: z.number(),
        description: z.string(),
        location: z.string(),
        link: z.string().optional(),
        departmentId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user?.isAdmin)
        throw new TRPCError({ code: "UNAUTHORIZED" });

      return await ctx.db.event.update({
        where: { id: input.id },
        data: {
          ...input,
          eventDate: new Date(input.eventDate),
        },
      });
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string().optional() }))
    .query(async ({ ctx, input: { id } }) => {
      if (!id) {
        return null;
      }
      return await ctx.db.event.findFirst({
        where: { id },
        include: { image: true },
      });
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user?.isAdmin) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const images = await ctx.db.image.findMany({
        where: { eventId: input },
        select: { key: true },
      });

      images.map(({ key }) => void utapi.deleteFiles(key));

      return await ctx.db.event.delete({
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
  addImageToEvent: protectedProcedure
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

      return await ctx.db.event.update({
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
