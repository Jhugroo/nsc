import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
type selecterType = {
  id: boolean;
  date: boolean;
  Menu?: {
    where: {
      kidId: string | null;
      createdById: string;
    };
    select: {
      fullyPaid: boolean;
      menuItems: {
        select: {
          id: boolean;
        };
      };
    };
  };
}
export const dateRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({
      date: z.number(),
      category: z.string(),
      location: z.string(),
      food: z.array(z.object({ id: z.string() }))
    }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user?.isAdmin) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }
      const dateExists = await ctx.db.date.findFirst({ where: { date: new Date(input.date), category: input.category, location: input.location } })
      if (dateExists) {
        return null
      }
      return await ctx.db.date.create({
        data: {
          category: input.category,
          date: new Date(input.date),
          food: { connect: input.food },
          location: input.location,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
        include: {
          food: true,
        },
      });
    }),
  update: protectedProcedure
    .input(z.object({
      food: z.array(z.object({ id: z.string() })),
      id: z.number()
    }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user?.isAdmin) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }
      return await ctx.db.date.update({
        where: {
          id: input.id
        },
        data: {
          food: { connect: input.food },
        },
        include: {
          food: true,
        },
      });
    }),
  delete: protectedProcedure.input(z.number())
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user?.isAdmin) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }
      return await ctx.db.date.delete({ where: { id: input } })
    }),
  getById: protectedProcedure
    .input(z.object({ id: z.number().optional() }))
    .query(async ({ ctx, input }) => {
      if (!input.id) {
        return null
      }
      return await ctx.db.date.findFirst({
        where: { id: input.id }, select: {
          date: true,
          food: {
            select: {
              id: true
            }
          }
        }
      });
    }),
  get: protectedProcedure
    .input(z.object({ category: z.string(), kidId: z.string().optional(), location: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      let selecter: selecterType = {
        id: true,
        date: true,
        Menu: {
          where: {
            createdById: ctx.session.user.id,
            kidId: null
          },
          select: {
            fullyPaid: true,
            menuItems: { select: { id: true } }
          }
        }
      }
      if (input) {
        if (input.kidId) {
          selecter = {
            id: true,
            date: true,
            Menu: {
              where: {
                kidId: input.kidId,
                createdById: ctx.session.user.id
              },
              select: {
                fullyPaid: true,
                menuItems: { select: { id: true } }
              }
            }
          }
        }
        return await ctx.db.date.findMany({
          where: { category: input.category, location: input.location ?? ctx.session.user.location, date: { gte: new Date(new Date().getTime() + parseInt(process.env.NO_OF_SECONDS_TO_ORDER!)) } },
          orderBy: { date: "asc" },
          select: selecter
        });
      }
      return await ctx.db.date.findMany({
        where: { location: ctx.session.user.location, date: { gte: new Date(new Date().getTime() + parseInt(process.env.NO_OF_SECONDS_TO_ORDER!)) } },
        orderBy: { date: "asc" },
        select: selecter
      });
    }),

});
