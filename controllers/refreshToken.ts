// controllers/refreshToken.ts

import { refreshToken } from "../lib/auth.ts";

export async function refreshTokenHandler(req: Request): Promise<Response> {
  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  const newToken = await refreshToken(token);
  if (!newToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  return new Response(JSON.stringify({ token: newToken }), {
    headers: { "Content-Type": "application/json" },
  });
}
