// backend/src/services/instagram.service.ts
import { IG_USER_ID, ACCESS_TOKEN } from "../utils/env.ts";

const GRAPH_API_BASE = "https://graph.facebook.com/v24.0";

export async function getInstagramInsights() {
    // 1) Reach (period = day)
    const reachParams = new URLSearchParams({
        metric: "reach",
        period: "day",
        access_token: ACCESS_TOKEN,
    });

    const reachUrl =
        `${GRAPH_API_BASE}/${IG_USER_ID}/insights?${reachParams.toString()}`;

    console.log(
        "Calling Graph API (reach):",
        reachUrl.replace(ACCESS_TOKEN, "TOKEN_REDACTED"),
    );

    const reachRes = await fetch(reachUrl);
    const reachData = await reachRes.json();

    // 2) Totals (profile_views + views, metric_type = total_value)
    const totalsParams = new URLSearchParams({
        metric: "profile_views,views",
        metric_type: "total_value",
        period: "day",
        access_token: ACCESS_TOKEN,
    });

    const totalsUrl =
        `${GRAPH_API_BASE}/${IG_USER_ID}/insights?${totalsParams.toString()}`;

    console.log(
        "Calling Graph API (totals):",
        totalsUrl.replace(ACCESS_TOKEN, "TOKEN_REDACTED"),
    );

    const totalsRes = await fetch(totalsUrl);
    const totalsData = await totalsRes.json();

    // Kombiniert zurückgeben
    return {
        reach: reachData,
        totals: totalsData,
    };
}