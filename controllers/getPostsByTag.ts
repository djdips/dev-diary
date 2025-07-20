import { storage } from "../lib/storage/index.ts"
import { RequestParams } from "../routes.ts"
import { errorResponse } from "../utils/errors.ts"

export async function getPostsByTag(
    _req: Request,
    params?: RequestParams
): Promise<Response> {
    const tagName = params?.pathParams.tagName

    if (!tagName) return errorResponse("Tag required", 400)

    try {
        const slugs = await storage.adapter.getPostsByTag(tagName)
        return new Response(JSON.stringify(slugs), {
            headers: { "Content-Type": "application/json" },
        })
    } catch (err) {
        console.error("Failed to get posts by tag:", err)
        return errorResponse("Failed to get posts by tag", 500)
    }
}
