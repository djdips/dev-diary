import { join } from "https://deno.land/std@0.224.0/path/mod.ts";
import { slugify } from "../utils/slugify.ts";

export async function createPost(req: Request): Promise<Response> {
  const POSTS_DIR = "posts";

  try {
    const { title, content } = await req.json();
    if (!title || !content) {
      return new Response("Missing title or content", { status: 400 });
    }
    const slug = slugify(title);
    const filepath = join(POSTS_DIR, `${slug}.md`);
    await Deno.writeTextFile(filepath, content);
    return Response.json({ message: "Post created", slug });
  } catch {
    return new Response("Invalid request", { status: 400 });
  }
}