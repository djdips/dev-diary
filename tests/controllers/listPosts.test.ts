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
    Deno.test(
        `getAllPosts: returns list with slug (${adapterName})`,
        async () => {
            storage.adapter = adapter

            const res = await listPosts()

            assertEquals(res.status, 200)
            const json = await res.json()

            const slugs = json.map((post: any) => post)
            assert(slugs.includes(TEST_SLUG))
        }
    )
}

await runTests("fileStorage", fileStorage)
await runTests("dbStorage", dbStorage)
