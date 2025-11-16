// backend/src/routes/instagram.routes.ts
import { Router } from "oak/router.ts";
import { getInsightsHandler } from "../controllers/instagram.controller.ts";

const router = new Router({
    prefix: "/api",
});

router.get("/insights", getInsightsHandler);

export default router;