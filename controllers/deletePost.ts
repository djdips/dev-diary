import { storage } from "../lib/storage/index.ts"
import { errorResponse } from "../utils/errors.ts"

export async function deletePost(
    _: Request,
    params?: { pathParams?: { slug?: string } }
): Promise<Response> {
    try {
        const slug = params?.pathParams?.slug
        if (!slug) return errorResponse("Missing slug", 400)

        await storage.adapter.deletePost(slug)
        return new Response("Post deleted", { status: 200 })
    } catch (err) {
        console.error(err)
        return errorResponse("Failed to delete post", 500)
    }
}
