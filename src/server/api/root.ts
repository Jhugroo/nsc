import { createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "./routers/user";
import { eventRouter } from "./routers/event";
import { departmentRouter } from "./routers/department";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  event: eventRouter,
  department: departmentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
