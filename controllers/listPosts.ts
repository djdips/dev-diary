export async function listPosts(): Promise<Response> {
  const POSTS_DIR = "posts";
  const posts: string[] = [];
  for await (const entry of Deno.readDir(POSTS_DIR)) {
    if (entry.isFile && entry.name.endsWith(".md")) {
      posts.push(entry.name.replace(".md", ""));
    }
  }
  return Response.json(posts);
}