import { POSTS_DIR } from "../../config.ts"
import { join } from "../../deps.ts"
import { parseMetadata } from "../../utils/parseMetadata.ts"
import type { StorageAdapter } from "../storage.ts"

export const fileStorage: StorageAdapter = {
    async listSlugs() {
        try {
            const files = []
            for await (const entry of Deno.readDir(POSTS_DIR)) {
                if (entry.isFile && entry.name.endsWith(".md")) {
                    files.push(entry.name.replace(".md", ""))
                }
            }
            return files
        } catch (err) {
            console.error("❌ fileStorage.listSlugs error:", err)
            // Graceful fallback: return empty array
            return []
        }
    },

    async getPost(slug) {
        try {
            return await Deno.readTextFile(join(POSTS_DIR, `${slug}.md`))
        } catch (err) {
            if (err instanceof Deno.errors.NotFound) {
                // Expected: post not found
                return null
            }
            console.error(`❌ fileStorage.getPost error for slug ${slug}:`, err)
            throw new Error("Failed to read post file")
        }
    },

    async getMetadata(slug) {
        try {
            const raw = await this.getPost(slug)
            if (!raw) return null
            const { metadata } = parseMetadata(raw)
            return metadata
        } catch (err) {
            console.error(
                `❌ fileStorage.getMetadata error for slug ${slug}:`,
                err
            )
            return null // Graceful fallback
        }
    },

    async getPostsByTag(tag) {
        try {
            const slugs = await this.listSlugs()
            const matched: string[] = []
            for (const slug of slugs) {
                const meta = await this.getMetadata(slug)
                if (meta?.tags?.includes(tag)) {
                    matched.push(slug)
                }
            }
            return matched
        } catch (err) {
            console.error(
                `❌ fileStorage.getPostsByTag error for tag ${tag}:`,
                err
            )
            return [] // Graceful fallback
        }
    },

    async savePost(slug, content) {
        try {
            await Deno.writeTextFile(join(POSTS_DIR, `${slug}.md`), content)
        } catch (err) {
            console.error(
                `❌ fileStorage.savePost error for slug ${slug}:`,
                err
            )
            throw new Error("Failed to save post")
        }
    },

    async deletePost(slug) {
        try {
            await Deno.remove(join(POSTS_DIR, `${slug}.md`))
        } catch (err) {
            if (!(err instanceof Deno.errors.NotFound)) {
                console.error(
                    `❌ fileStorage.deletePost error for slug ${slug}:`,
                    err
                )
                throw new Error("Failed to delete post")
            }
            // If file not found, treat as success (idempotent)
        }
    },

    async searchPosts(query) {
        try {
            const slugs = await this.listSlugs()
            const matched: string[] = []

            for (const slug of slugs) {
                const raw = await this.getPost(slug)
                if (!raw) continue
                const { metadata, content } = parseMetadata(raw)
                if (
                    metadata.title?.includes(query) ||
                    metadata.tags?.some(t => t.includes(query)) ||
                    content.includes(query)
                ) {
                    matched.push(slug)
                }
            }

            return matched
        } catch (err) {
            console.error(
                `❌ fileStorage.searchPosts error for query "${query}":`,
                err
            )
            return [] // Graceful fallback
        }
    },
}
