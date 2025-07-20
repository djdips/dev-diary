import {
    assert,
    assertEquals,
    assertMatch,
} from "https://deno.land/std@0.224.0/assert/mod.ts"
import { storage } from "../../lib/storage/index.ts"
import { dbStorage } from "../../lib/storage/dbStorage.ts"
import { fileStorage } from "../../lib/storage/fileStorage.ts"
import { getPost } from "../../controllers/getPost.ts"
import { listPosts } from "../../controllers/listPosts.ts"

const TEST_SLUG = "get-post-test"
const RAW = `---
title: Test Get Post
date: 2025-07-20
tags: [test]
---
This is a test post.`

// Helper to mock a request
function mockRequest(body?: any): Request {
    return new Request("http://localhost/post", {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
    })
}

async function runTests(adapterName: string, adapter: typeof storage.adapter) {
    Deno.test(`getPostBySlug: returns post (${adapterName})`, async () => {
        storage.adapter = adapter

        await adapter.savePost(TEST_SLUG, RAW)

        const req = mockRequest()
        const res = await getPost(req, {
            pathParams: { slug: TEST_SLUG },
            queryParams: {},
        })

        assertEquals(res.status, 200)

        const text = await res.text()

        assertMatch(text, /<p>This is a test post\.<\/p>/)
        assertMatch(text, /<h2>title: Test Get Post/)
    })

    Deno.test("getPostBySlug returns 404 for non-existing post", async () => {
        storage.adapter = fileStorage

        const NON_EXISTENT_SLUG = "non-existent-post"

        const req = mockRequest()
        const res = await getPost(req, {
            pathParams: { slug: NON_EXISTENT_SLUG },
            queryParams: {},
        })

        assertEquals(res.status, 404)

        const text = await res.text()
        assertMatch(text, /Post not found/i)
    })
}

await runTests("fileStorage", fileStorage)
await runTests("dbStorage", dbStorage)
