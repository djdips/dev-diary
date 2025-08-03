import {
    assert,
    assertEquals,
    assertMatch,
} from "https://deno.land/std@0.224.0/assert/mod.ts"
import { storage } from "../../lib/storage/index.ts"
import { dbStorage } from "../../lib/storage/dbStorage.ts"
import { fileStorage } from "../../lib/storage/fileStorage.ts"
import { login } from "../../controllers/login.ts";

const TEST_SLUG = "get-post-test"
const RAW = `---
title: Test Get Post
date: 2025-07-20
tags: [test]
---
This is a test post.`

// Helper to mock a request
function mockRequest(body?: any): Request {
    return new Request("http://localhost/login", {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
    })
}

async function runTests(adapterName: string, adapter: typeof storage.adapter) {
    Deno.test(
        `login - success returns token (${adapterName})`,
        async () => {
            storage.adapter = adapter

            const res = await login(mockRequest({ username: "admin", password: "secret" }))

            assertEquals(res.status, 200)
            const json = await res.json()

            assert(json.token)
        }
    )

    Deno.test(
        `login - failure returns error (${adapterName})`,
        async () => {
            storage.adapter = adapter

            const res = await login(mockRequest({ username: "admin", password: "wrong" }))

            assertEquals(res.status, 401)
            const text = await res.text();
            assert(text.includes("Unauthorized"));
        }
    )
}

await runTests("fileStorage", fileStorage)
await runTests("dbStorage", dbStorage)
