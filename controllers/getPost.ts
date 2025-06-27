import { marked } from "../deps.ts"
import { RequestParams } from "../routes.ts"
import { storage } from "../lib/storage/index.ts"
import { errorResponse } from "../utils/errors.ts"

export async function getPost(
    _req: Request,
    params: RequestParams
): Promise<Response> {
    const slug = params?.pathParams.slug
    const content = await storage.getPost(slug)

    if (!content) {
        return errorResponse("Post not found", 404)
    }

    try {
        const html = await marked(content)
        return new Response(html, {
            headers: { "Content-Type": "text/html" },
        })
    } catch (err) {
        console.error(err)
        return errorResponse("Failed to render post", 500)
    }
}
