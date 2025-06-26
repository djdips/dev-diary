import { join, extname } from "../deps.ts";
import { RequestParams } from "../routes.ts";
import { parseMetadata } from "../utils/parseMetadata.ts";

const POSTS_DIR = "posts";

export async function getPostsByTag(_: Request, params?: RequestParams): Promise<Response> {
  const tagName = params?.pathParams?.tagName;
  if (!tagName) return new Response("Bad Request", { status: 400 });

  const posts: string[] = [];

  for await (const entry of Deno.readDir(POSTS_DIR)) {
    if (entry.isFile && extname(entry.name) === ".md") {
      const filepath = join(POSTS_DIR, entry.name);
      const raw = await Deno.readTextFile(filepath);
      const { metadata } = parseMetadata(raw);

      const tagsRaw = metadata.tags;
      const tags: string[] = Array.isArray(tagsRaw)
        ? tagsRaw.filter((t): t is string => typeof t === "string")
        : [];

      if (tags.includes(tagName)) {
        posts.push(entry.name.replace(".md", ""));
      }
    }
  }

  return Response.json(posts);
}
