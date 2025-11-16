// backend/src/utils/env.ts
import { load } from "dotenv/mod.ts";

await load({ export: true });

export const IG_USER_ID = Deno.env.get("IG_USER_ID")!;
export const ACCESS_TOKEN = Deno.env.get("ACCESS_TOKEN")!;

console.log("IG_USER_ID:", IG_USER_ID);
console.log("ACCESS_TOKEN length:", ACCESS_TOKEN?.length);