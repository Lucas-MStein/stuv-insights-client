// backend/src/app.ts
import { Application } from "oak/mod.ts";
import instagramRoutes from "./routes/instagram.routes.ts";

const app = new Application();

// simple Logging
app.use(async (ctx, next) => {
    console.log(`${ctx.request.method} ${ctx.request.url.pathname}`);
    await next();
});

// Routen registrieren
app.use(instagramRoutes.routes());
app.use(instagramRoutes.allowedMethods());

const PORT = 3000;
console.log(`Server running on http://localhost:${PORT}`);
await app.listen({ port: PORT });