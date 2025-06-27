// deno-lint-ignore-file require-await
// db/dbStorage.ts
import { DB } from "../../deps.ts"
import { parseMetadata } from "../../utils/parseMetadata.ts"
import { StorageAdapter } from "../storage.ts"

const db = new DB("devdiary.db")

try {
    db.execute(`
    CREATE TABLE IF NOT EXISTS posts (
      slug TEXT PRIMARY KEY,
      raw TEXT NOT NULL,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      tags TEXT NOT NULL
    );
  `)
} catch (err) {
    console.error("❌ Failed to initialize DB:", err)
}

export const dbStorage: StorageAdapter = {
    async listSlugs() {
        try {
            const rows = [...db.query("SELECT slug FROM posts")]
            return rows.map(([slug]) => slug as string)
        } catch (err) {
            console.error("❌ dbStorage.listSlugs error:", err)
            return [] // graceful fallback
        }
    },

    async getPost(slug) {
        try {
            for (const [raw] of db.query(
                "SELECT raw FROM posts WHERE slug = ?",
                [slug]
            )) {
                return raw as string
            }
            return null // not found
        } catch (err) {
            console.error(`❌ dbStorage.getPost error for slug ${slug}:`, err)
            throw new Error("Database error retrieving post")
        }
    },

    async getMetadata(slug) {
        try {
            for (const [title, date, tags] of db.query(
                "SELECT title, date, tags FROM posts WHERE slug = ?",
                [slug]
            )) {
                return {
                    title: title as string,
                    date: date as string,
                    tags: JSON.parse(tags as string),
                }
            }
            return null
        } catch (err) {
            console.error(
                `❌ dbStorage.getMetadata error for slug ${slug}:`,
                err
            )
            return null
        }
    },

    async getPostsByTag(tag) {
        try {
            const matched: string[] = []
            const rows = [...db.query("SELECT slug, tags FROM posts")]
            for (const [slug, tags] of rows) {
                const tagsArr = JSON.parse(tags as string)
                if (tagsArr.includes(tag)) {
                    matched.push(slug as string)
                }
            }
            return matched
        } catch (err) {
            console.error(
                `❌ dbStorage.getPostsByTag error for tag ${tag}:`,
                err
            )
            return []
        }
    },

    async savePost(slug, raw) {
        try {
            const { metadata } = parseMetadata(raw)

            const title = metadata.title ?? slug
            const date = metadata.date ?? new Date().toISOString()
            const tags = JSON.stringify(metadata.tags ?? [])

            db.query(
                `
        INSERT INTO posts (slug, raw, title, date, tags)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(slug) DO UPDATE SET
          raw = excluded.raw,
          title = excluded.title,
          date = excluded.date,
          tags = excluded.tags
        `,
                [slug, raw, title, date, tags]
            )
        } catch (err) {
            console.error(`❌ dbStorage.savePost error for slug ${slug}:`, err)
            throw new Error("Failed to save post to DB")
        }
    },

    async deletePost(slug) {
        try {
            db.query("DELETE FROM posts WHERE slug = ?", [slug])
        } catch (err) {
            console.error(
                `❌ dbStorage.deletePost error for slug ${slug}:`,
                err
            )
            throw new Error("Failed to delete post from DB")
        }
    },

    async searchPosts(query) {
        try {
            const matched: string[] = []
            const rows = [
                ...db.query("SELECT slug, title, tags, raw FROM posts"),
            ]

            for (const [slug, title, tags, raw] of rows) {
                const slugStr = slug as string
                const titleStr = title as string
                const tagsArr = JSON.parse(tags as string) as string[]
                const rawStr = raw as string

                if (
                    titleStr.includes(query) ||
                    tagsArr.some(t => t.includes(query)) ||
                    rawStr.includes(query)
                ) {
                    matched.push(slugStr)
                }
            }

            return matched
        } catch (err) {
            console.error(
                `❌ dbStorage.searchPosts error for query "${query}":`,
                err
            )
            return []
        }
    },
}
