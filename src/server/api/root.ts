import { createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "./routers/user";
import { eventRouter } from "./routers/event";
import { departmentRouter } from "./routers/department";
import { departmentPageRouter } from "./routers/departmentPage";
import { initiativesRouter } from "./routers/initiatives";
import { teamRouter } from "./routers/team";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  event: eventRouter,
  department: departmentRouter,
  departmentPage: departmentPageRouter,
  initiatives: initiativesRouter,
  team: teamRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
