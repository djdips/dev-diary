import { storage } from "../lib/storage/index.ts"
import { RequestParams } from "../routes.ts"
import { errorResponse } from "../utils/errors.ts"
import { validatePostContent, validateSlug } from "../utils/validation.ts"

export async function createPost(
    req: Request,
    params: RequestParams
): Promise<Response> {
    const slug = params?.pathParams?.slug || ""
    const body = await req.json()
    const title = body.title || slug
    const content = body.content

    if (!title || !content) {
        return errorResponse("Missing title or content", 400)
    }

    if (!validateSlug(slug)) {
        return errorResponse("Invalid slug", 400)
    }

    if (!validatePostContent(content)) {
        return errorResponse("Content cannot be empty", 400)
    }

    try {
        const fullContent = `---\ntitle: ${title}\ndate: ${new Date().toISOString()}\ntags: []\n---\n${content}`

        await storage.savePost(title, fullContent)
        return new Response("Post saved", { status: 201 })
    } catch (err) {
        console.error(err)
        return errorResponse("Failed to save post", 500)
    }
}
