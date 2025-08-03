import { storage } from "../lib/storage/index.ts"
import { RequestParams } from "../routes.ts"
import { errorResponse } from "../utils/errors.ts"
import { slugify } from "../utils/slugify.ts";
import { validatePostContent, validateSlug } from "../utils/validation.ts"

export async function createPost(
    req: Request,
    params?: RequestParams
): Promise<Response> {
    const body = await req.json()
    const title = body.title?.trim()
    const content = body.content

    if (!title || !content) {
        return errorResponse("Missing title or content", 400)
    }

    const slug = slugify(title);

    if (!validateSlug(slug)) {
        return errorResponse("Invalid slug", 400)
    }

    try {
        const fullContent = `---\ntitle: ${title}\ndate: ${new Date().toISOString()}\ntags: []\n---\n${content}`

        await storage.adapter.savePost(slug, fullContent)
        return new Response("Post saved", { status: 201 })
    } catch (err) {
        console.error(err)
        return errorResponse("Failed to save post", 500)
    }
}
