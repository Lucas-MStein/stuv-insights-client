// backend/src/controllers/instagram.controller.ts
import type { Context } from "oak/mod.ts";
import { getInstagramInsights } from "../services/instagram.service.ts";

export async function getInsightsHandler(ctx: Context) {
    try {
        const data = await getInstagramInsights();
        ctx.response.status = 200;
        ctx.response.type = "json";
        ctx.response.body = data;
    } catch (err) {
        console.error("Error in getInsightsHandler:", err);
        ctx.response.status = 500;
        ctx.response.body = { error: "Failed to fetch Instagram insights" };
    }
}