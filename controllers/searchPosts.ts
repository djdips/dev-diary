import { join } from "../deps.ts"
import { RequestParams } from "../routes.ts"
import { parseMetadata } from "../utils/parseMetadata.ts"

export async function searchPosts(
    _: Request,
    params?: RequestParams
): Promise<Response> {
    const POSTS_DIR = "posts"
    const query = params?.queryParams?.q
    
    if (!query) {
        return new Response(JSON.stringify([]), {
            headers: { "Content-Type": "application/json" },
        })
    }

    const files = []
    for await (const entry of Deno.readDir(POSTS_DIR)) {
        if (entry.isFile && entry.name.endsWith(".md")) {
            files.push(entry.name)
        }
    }

    const matchedSlugs: string[] = []

    for (const fileName of files) {
        const filePath = join(POSTS_DIR, fileName)
        const raw = await Deno.readTextFile(filePath)
        const { metadata, content } = parseMetadata(raw)

        if (
            (metadata.title && metadata.title.includes(query)) ||
            (metadata.tags && metadata.tags.includes(query)) ||
            content.includes(query)
        ) {
            matchedSlugs.push(fileName.replace(".md", ""))
        }
    }
    return new Response(JSON.stringify(matchedSlugs), {
        headers: { "Content-Type": "application/json" },
    })
}
