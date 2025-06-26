import { listPosts } from "./controllers/listPosts.ts";
import { getPost } from "./controllers/getPost.ts";
import { createPost } from "./controllers/createPost.ts";
import { deletePost } from "./controllers/deletePost.ts";
import { getPostMeta } from "./controllers/getPostMeta.ts";
import { getPostsByTag } from "./controllers/getPostsByTag.ts";
import { searchPosts } from "./controllers/searchPosts.ts";
import { login } from "./controllers/login.ts";
import { withAuth } from "./middleware/auth.ts";
import { editPostBySlug } from "./controllers/editPostBySlug.ts";
import { refreshTokenHandler } from "./controllers/refreshToken.ts";

export type RequestParams = {
  pathParams: Record<string, string>;
  queryParams: Record<string, string>;
};

type RouteHandler = (req: Request, params?: RequestParams) => Promise<Response>;

const routes: Record<string, Record<string, RouteHandler>> = {
  GET: {
    "/posts": (req) => withAuth(req, () => listPosts()),
    "/post/:slug": (req, params) => withAuth(req, () => getPost(req, params)),
    "/post/:slug/meta": (req, params) => withAuth(req, () => getPostMeta(req, params)),
    "/tag/:tagName": (req, params) => withAuth(req, () => getPostsByTag(req, params)),
    "/search": (req, params) => withAuth(req, () => searchPosts(req, params)),
  },
  POST: {
    "/post": (req) => withAuth(req, () => createPost(req)),
    "/login": login,
    "/refresh-token": refreshTokenHandler, // Assuming refreshToken is handled in login
  },
  PUT: {
    "/post/:slug": (req, params) => withAuth(req, () => editPostBySlug(req, params)),
  },
  DELETE: {
    "/post/:slug": (req, params) => withAuth(req, () => deletePost(req, params)),
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
      
      const queryParams: Record<string, string> = {};
      url.searchParams.forEach((value, key) => {
        queryParams[key] = value;
      });

      return await methodRoutes[pattern](req, {pathParams: match.params, queryParams: queryParams} as RequestParams);
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
