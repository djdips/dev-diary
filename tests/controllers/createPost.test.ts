import {
    assertEquals,
    assertMatch,
} from "https://deno.land/std@0.224.0/assert/mod.ts"
import { storage } from "../../lib/storage/index.ts"
import { dbStorage } from "../../lib/storage/dbStorage.ts"
import { fileStorage } from "../../lib/storage/fileStorage.ts"
import { createPost } from "../../controllers/createPost.ts"

const TEST_SLUG = "db-test"
const RAW = `---
title: DB Test
date: 2025-07-07
tags: [db]
---
Hello DB!`

// Helper to mock a request
function mockRequest(body: any): Request {
    return new Request("http://localhost/post", {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
    })
}

Deno.test("createPost: dbStorage - save and retrieve post", async () => {
    storage.adapter = dbStorage

    await storage.adapter.savePost(TEST_SLUG, RAW)
    const raw = await storage.adapter.getPost(TEST_SLUG)
    assertEquals(typeof raw, "string")
    assertMatch(raw!, /Hello DB!/)
})

Deno.test("createPost: fileStorage - save and retrieve post", async () => {
    storage.adapter = fileStorage

    await storage.adapter.savePost(TEST_SLUG, RAW)
    const raw = await storage.adapter.getPost(TEST_SLUG)
    assertEquals(typeof raw, "string")
    assertMatch(raw!, /Hello DB!/)
})

Deno.test(
    "createPost: returns 400 if title or content is missing",
    async () => {
        const req = mockRequest({ title: "", content: "" })
        const res = await createPost(req)
        const text = await res.text()

        const parsedText = JSON.parse(text)

        assertEquals(res.status, 400)
        assertEquals(parsedText?.error, "Missing title or content")
    }
)

Deno.test("createPost: returns 400 for invalid slug", async () => {
    const req = mockRequest({ title: "!!!", content: RAW })
    const res = await createPost(req)
    const text = await res.text()

    const parsedText = JSON.parse(text)

    assertEquals(res.status, 400)
    assertEquals(parsedText?.error, "Invalid slug")
})

Deno.test("createPost: returns 400 for empty content", async () => {
    const req = mockRequest({ title: TEST_SLUG, content: "" })
    const res = await createPost(req)
    const text = await res.text()

    const parsedText = JSON.parse(text)

    assertEquals(res.status, 400)
    assertEquals(parsedText?.error, "Missing title or content")
})

Deno.test("createPost: returns 201 for valid input", async () => {
    const req = mockRequest({ title: TEST_SLUG, content: RAW })
    const res = await createPost(req)
    const text = await res.text()

    assertEquals(res.status, 201)
    assertEquals(text, "Post saved")
})
