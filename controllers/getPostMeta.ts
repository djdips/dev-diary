import { storage } from "../lib/storage/index.ts"
import { RequestParams } from "../routes.ts"
import { errorResponse } from "../utils/errors.ts"

export async function getPostMeta(
    _req: Request,
    params?: RequestParams
): Promise<Response> {
    try {
        const slug = params?.pathParams.slug
        if (!slug) return errorResponse("Missing slug", 400)

        const metadata = await storage.adapter.getMetadata(slug)

        if (!metadata) {
            return errorResponse("Post not found", 404)
        }

        return new Response(JSON.stringify(metadata), {
            headers: { "Content-Type": "application/json" },
        })
    } catch (err) {
        console.error(err)
        return errorResponse("Failed to retrieve post metadata", 500)
    }
}
