import { storage } from "../lib/storage/index.ts"
import { RequestParams } from "../routes.ts"
import { errorResponse } from "../utils/errors.ts"

export async function deletePost(
    _req: Request,
    params: RequestParams
): Promise<Response> {
    try {
        const slug = params?.pathParams.slug
        
        await storage.deletePost(slug)
        return new Response("Post deleted", { status: 200 })
    } catch (err) {
        console.error(err)
        return errorResponse("Failed to delete post", 500)
    }
}
