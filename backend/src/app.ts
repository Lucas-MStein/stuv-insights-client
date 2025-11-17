// backend/src/app.ts
import { Application } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";

import instagramRoutes from "./routes/instagram.routes.ts";

const app = new Application();

// 🔓 CORS für dein Frontend erlauben
app.use(
    oakCors({
        origin: "http://localhost:5173", // Vite-Dev-Server
    }),
);

// (optional) Logging-Middleware
app.use(async (ctx, next) => {
    console.log(`${ctx.request.method} ${ctx.request.url.pathname}`);
    await next();
});

// Instagram-Routes anhängen
app.use(instagramRoutes.routes());
app.use(instagramRoutes.allowedMethods());

const PORT = 3000;
console.log(`Server running on http://localhost:${PORT}`);
await app.listen({ port: PORT });