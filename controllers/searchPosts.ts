import { storage } from "../lib/storage/index.ts"
import { RequestParams } from "../routes.ts"
import { errorResponse } from "../utils/errors.ts"

export async function searchPosts(
    _req: Request,
    params?: RequestParams
): Promise<Response> {
    const query = params?.queryParams.q || ""
    if (!query) return errorResponse("Query required", 400)

    try {
        const slugs = await storage.adapter.searchPosts(query)
        return new Response(JSON.stringify(slugs), {
            headers: { "Content-Type": "application/json" },
        })
    } catch (err) {
        console.error("Failed to search posts:", err)
        return errorResponse("Failed to search posts", 500)
    }
}
