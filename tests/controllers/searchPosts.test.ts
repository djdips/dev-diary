import {
    assert,
    assertEquals,
    assertMatch,
} from "https://deno.land/std@0.224.0/assert/mod.ts"
import { storage } from "../../lib/storage/index.ts"
import { dbStorage } from "../../lib/storage/dbStorage.ts"
import { fileStorage } from "../../lib/storage/fileStorage.ts"
import { searchPosts } from "../../controllers/searchPosts.ts"

const TEST_SLUG = "search-post-test"
const RAW = `---
title: Test search Post
date: 2025-07-20
tags: [test]
---
This is a search test post.`

// Helper to mock a request
function mockRequest(): Request {
    return new Request("http://localhost/post", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    })
}

async function runTests(adapterName: string, adapter: typeof storage.adapter) {
    Deno.test(`searchPosts: returns slug (${adapterName})`, async () => {
        storage.adapter = adapter

        await adapter.savePost(TEST_SLUG, RAW)

        const req = mockRequest()
        const res = await searchPosts(req, {
            pathParams: {},
            queryParams: { q: "search" },
        })

        assertEquals(res.status, 200)

        const slugs = await res.json()

        assertEquals(Array.isArray(slugs), true);
        assertEquals(slugs.length, 1);
        assertEquals(slugs[0], TEST_SLUG);
    })

    Deno.test("searchPosts returns 404 for non-existing post", async () => {
        storage.adapter = fileStorage

        const NON_EXISTENT_SLUG = "non-existent-post"

        const req = mockRequest()
        const res = await searchPosts(req, {
            pathParams: {},
            queryParams: { q: NON_EXISTENT_SLUG },
        })
        const slugs = await res.json();

        assertEquals(slugs.length, 0);
    })
}

await runTests("fileStorage", fileStorage)
await runTests("dbStorage", dbStorage)
