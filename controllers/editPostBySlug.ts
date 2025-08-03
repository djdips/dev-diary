import { storage } from "../lib/storage/index.ts"
import { errorResponse } from "../utils/errors.ts"
import { parseMetadata } from "../utils/parseMetadata.ts"
import { validatePostContent, validateSlug } from "../utils/validation.ts"

export async function editPostBySlug(
    req: Request,
    params?: { pathParams?: { slug?: string } }
): Promise<Response> {
    const slug = params?.pathParams?.slug
    if (!slug) return errorResponse("Missing slug", 400)

    const body = await req.json()
    const { content } = body

    if (!validateSlug(slug)) {
        return errorResponse("Invalid slug", 400)
    }

    if (!validatePostContent(content)) {
        return errorResponse("Content missing", 400)
    }

    try {
        const oldContent = await storage.adapter.getPost(slug)
        if (!oldContent) {
            return errorResponse("Post not found", 404)
        }

        // Parse existing metadata (frontmatter)
        const { metadata } = parseMetadata(oldContent)

        // Rebuild markdown content preserving metadata
        const frontmatter = Object.entries(metadata)
            .map(([key, value]) => {
                if (Array.isArray(value)) {
                    return `${key}:\n${value.map(v => `  - ${v}`).join("\n")}`
                }
                return `${key}: ${value}`
            })
            .join("\n")

        const updatedContent = `---\n${frontmatter}\n---\n${content}`

        await storage.adapter.savePost(slug, updatedContent)
        return new Response("Post updated", { status: 200 })
    } catch (err) {
        console.error(err)
        return errorResponse("Failed to update post", 500)
    }
}
