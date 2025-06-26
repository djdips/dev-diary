import { join } from "https://deno.land/std@0.224.0/path/mod.ts";
import { RequestParams } from "../routes.ts";

export async function deletePost(_: Request, params?: RequestParams): Promise<Response> {
  const POSTS_DIR = "posts";
  const slug = params?.pathParams?.slug;
  if (!slug) return new Response("Bad Request", { status: 400 });

  const filepath = join(POSTS_DIR, `${slug}.md`);
  try {
    await Deno.remove(filepath);
    return Response.json({ message: "Post deleted", slug });
  } catch {
    return new Response("Post not found", { status: 404 });
  }
}