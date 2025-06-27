// scripts/migrate.ts
import { POSTS_DIR } from "../config.ts";
import { walk } from "../deps.ts";
import { dbStorage } from "../lib/storage/dbStorage.ts";


for await (const entry of walk(POSTS_DIR, { exts: [".md"] })) {
  const slug = entry.name.replace(".md", "");
  const raw = await Deno.readTextFile(entry.path);
  await dbStorage.savePost(slug, raw);
  console.log(`✅ Migrated post: ${slug}`);
}
