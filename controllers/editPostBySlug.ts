import { join } from "../deps.ts";

export async function editPostBySlug(
  _: Request,
  params?: { pathParams?: { slug?: string } },
): Promise<Response> {
    const POSTS_DIR = "posts";
  const slug = params?.pathParams?.slug;
  if (!slug) return new Response("Bad Request - Missing or Incorrect Slug", { status: 400 });

  const filepath = join(POSTS_DIR, `${slug}.md`);

  try {
    const raw = await Deno.readTextFile(filepath);
    return new Response(raw, {
      headers: { "Content-Type": "text/plain" },
    });
  } catch {
    return new Response("Failed to update post", { status: 500 });
  }
}