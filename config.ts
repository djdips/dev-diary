// config.ts
import "https://deno.land/std@0.224.0/dotenv/load.ts";

export const STORAGE_MODE = Deno.env.get("STORAGE") ?? "file";
export const POSTS_DIR = Deno.env.get("POSTS_DIR") ?? "posts";