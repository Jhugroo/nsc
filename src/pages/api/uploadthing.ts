import { ourFileRouter } from "@/server/uploadthing";
import { createRouteHandler } from "uploadthing/next-legacy";


export default createRouteHandler({
    router: ourFileRouter,

    // Apply an (optional) custom config:
    // config: { ... },
});