import { join } from "../deps.ts";
import { RequestParams } from "../routes.ts";
import { parseMetadata } from "../utils/parseMetadata.ts";

const POSTS_DIR = "posts";

export async function getPostMeta(_: Request, params?: RequestParams): Promise<Response> {
  const slug = params?.pathParams?.slug;
  if (!slug) return new Response("Bad Request", { status: 400 });

  const filepath = join(POSTS_DIR, `${slug}.md`);

  try {
    const raw = await Deno.readTextFile(filepath);
    const { metadata } = parseMetadata(raw);
    return Response.json(metadata);
  } catch {
    return new Response("Post not found", { status: 404 });
  }
}
