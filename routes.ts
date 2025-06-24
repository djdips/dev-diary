import { listPosts } from "./controllers/listPosts.ts";
import { getPost } from "./controllers/getPost.ts";
import { createPost } from "./controllers/createPost.ts";
import { deletePost } from "./controllers/deletePost.ts";
import { getPostMeta } from "./controllers/getPostMeta.ts";
import { getPostsByTag } from "./controllers/getPostsByTag.ts";

type RouteHandler = (req: Request, params?: Record<string, string>) => Promise<Response>;

const routes: Record<string, Record<string, RouteHandler>> = {
  GET: {
    "/posts": listPosts,
    "/post/:slug": getPost,
    "/post/:slug/meta": getPostMeta,
    "/tag/:tagName": getPostsByTag,
  },
  POST: {
    "/post": createPost,
  },
  DELETE: {
    "/post/:slug": deletePost,
  },
};

export async function handleRequest(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const method = req.method.toUpperCase();

  const methodRoutes = routes[method];
  if (!methodRoutes) return new Response("Method Not Allowed", { status: 405 });

  for (const pattern in methodRoutes) {
    const match = matchRoute(pattern, url.pathname);
    if (match) {
      return await methodRoutes[pattern](req, match.params);
    }
  }

  return new Response("Not Found", { status: 404 });
}

function matchRoute(pattern: string, path: string): { params: Record<string, string> } | null {
  const patternParts = pattern.split("/");
  const pathParts = path.split("/");

  if (patternParts.length !== pathParts.length) return null;

  const params: Record<string, string> = {};

  for (let i = 0; i < patternParts.length; i++) {
    const patternPart = patternParts[i];
    const pathPart = pathParts[i];

    if (patternPart.startsWith(":")) {
      params[patternPart.slice(1)] = pathPart;
    } else if (patternPart !== pathPart) {
      return null;
    }
  }

  return { params };
}
