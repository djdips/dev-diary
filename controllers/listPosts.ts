import { storage } from "../lib/storage/index.ts"
import { errorResponse } from "../utils/errors.ts"

export async function listPosts(): Promise<Response> {
    try {
        const slugs = await storage.adapter.listSlugs()
        return new Response(JSON.stringify(slugs), {
            headers: { "Content-Type": "application/json" },
        })
    } catch (err) {
        console.error("Failed to list posts:", err)
        return errorResponse("Failed to list posts", 500)
    }
}
