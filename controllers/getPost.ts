import { marked } from "../deps.ts";
import { join } from "../deps.ts";
import { RequestParams } from "../routes.ts";
import { parseMetadata } from "../utils/parseMetadata.ts";

const POSTS_DIR = "posts";

export async function getPost(_: Request, params?: RequestParams): Promise<Response> {
  const slug = params?.pathParams?.slug;
  if (!slug) return new Response("Bad Request - Missing or Incorrect Slug", { status: 400 });

  const filepath = join(POSTS_DIR, `${slug}.md`);

  try {
    const raw = await Deno.readTextFile(filepath);
    const { metadata, content } = parseMetadata(raw);
    const html = await marked(content);
    const body = `
      <article>
        <h1>${metadata.title || slug}</h1>
        <small>${metadata.date || ""}</small>
        <div>${html}</div>
      </article>
    `;

    return new Response(body, {
      headers: { "Content-Type": "text/html" },
    });
  } catch {
    return new Response("Post not found", { status: 404 });
  }
}
