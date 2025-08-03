import {
    assertEquals,
    assertRejects,
} from "https://deno.land/std@0.224.0/assert/mod.ts"
import { storage } from "../../lib/storage/index.ts"
import { fileStorage } from "../../lib/storage/fileStorage.ts"
import { dbStorage } from "../../lib/storage/dbStorage.ts"
import { deletePost } from "../../controllers/deletePost.ts"

const TEST_SLUG = "delete-test"
const RAW = `---
title: Delete Test
date: 2025-07-01
tags: [delete]
---
To be deleted`

// Helper to mock a request
function mockRequest(body: any): Request {
    return new Request("http://localhost/post", {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
    })
}

for (const adapter of [fileStorage, dbStorage]) {
    Deno.test(
        `deletePostBySlug: deletes post using ${storage.name}`,
        async () => {
            storage.adapter = adapter

            await adapter.savePost(TEST_SLUG, RAW)

            const req = mockRequest(RAW)
            const res = await deletePost(req, {
                pathParams: { slug: TEST_SLUG },
            })

            assertEquals(res.status, 200)

            const raw = await adapter.getPost(TEST_SLUG)
            console.log("Post after delete:", raw)
            assertEquals(raw, null)
        }
    )

    Deno.test("deletePost: returns 500 if deletePost throws", async () => {
        const originalDeletePost = storage.adapter.deletePost
    
        // Mock deletePost to throw an error
        storage.adapter.deletePost = () => {
          throw new Error("Simulated failure")
        }
      
        const req = new Request("http://localhost/posts", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        })
      
        const res = await deletePost(req, {
          pathParams: { slug: TEST_SLUG },
        })
        const post = await res.json()
      
        assertEquals(res.status, 500)
        assertEquals(post?.error, "Failed to delete post")
      
        // Restore original implementation
        storage.adapter.deletePost = originalDeletePost
      })
}
