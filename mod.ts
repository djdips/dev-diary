import { handleRequest } from "./routes.ts";
import { serveFile } from "https://deno.land/std@0.224.0/http/file_server.ts";
import { join } from "./deps.ts";

const PUBLIC_DIR = "public";

console.log("✅ DevDiary running at http://localhost:8000");

Deno.serve(async (req) => {
  try {
    const url = new URL(req.url);
    const pathname = url.pathname;

    // Serve static files for requests starting with /public or requests with extensions
    if (
      pathname === "/" ||
      pathname.startsWith("/public") ||
      /\.[a-zA-Z0-9]+$/.test(pathname)
    ) {
      // Map "/" to "/index.html"
      const filePath = pathname === "/" ? "/index.html" : pathname;

      // Normalize path to avoid directory traversal
      const fullPath = join(PUBLIC_DIR, decodeURIComponent(filePath));

      // Try to serve file
      return await serveFile(req, fullPath);
    }

    // Otherwise, handle as API request
    return await handleRequest(req);
  } catch (err) {
    console.error("Error serving file or API:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
});
