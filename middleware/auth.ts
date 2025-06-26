import { isTokenValid } from "../lib/auth.ts";

export async function withAuth(
  req: Request,
  handler: () => Promise<Response>
): Promise<Response> {
  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.replace("Bearer ", "") ?? "";

  if (!isTokenValid(token)) {
    return new Response("Unauthorized", { status: 401 });
  }

  return await handler();
}