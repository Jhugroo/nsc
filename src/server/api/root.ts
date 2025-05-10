import { createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "./routers/user";
import { dateRouter } from "./routers/date";
import { locationRouter } from "./routers/location";
import { eventRouter } from "./routers/event";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  date: dateRouter,
  event: eventRouter,
  location: locationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
