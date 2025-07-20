import {
    assertEquals,
    assertMatch,
} from "https://deno.land/std@0.224.0/assert/mod.ts"
import { storage } from "../../lib/storage/index.ts"
import { dbStorage } from "../../lib/storage/dbStorage.ts"
import { fileStorage } from "../../lib/storage/fileStorage.ts"
import { createPost } from "../../controllers/createPost.ts"
import { editPostBySlug } from "../../controllers/editPostBySlug.ts"

const TEST_SLUG = "db-test"
const ORIGINAL_RAW = `---
title: DB Test
date: 2025-07-07
tags: [db]
---
Hello DB!`

const UPDATED_BODY = {
    title: "Edit Test",
    content: "Hello World",
}

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
        `editPostBySlug: update content with ${storage.name}`,
        async () => {
            storage.adapter = adapter

            await adapter.savePost(TEST_SLUG, ORIGINAL_RAW)

            const req = mockRequest(UPDATED_BODY)
            const res = await editPostBySlug(req, {
                pathParams: { slug: TEST_SLUG },
            })
            const text = await res.text()

            assertEquals(res.status, 200)
            assertMatch(text, /Post updated/)

            const raw = await adapter.getPost(TEST_SLUG)
            assertEquals(typeof raw, "string")
            assertMatch(raw!, /Hello World/)
        }
    )

    Deno.test(`editPostBySlug: returns 404 for non existent slug`, async () => {
        storage.adapter = adapter

        await adapter.savePost(TEST_SLUG, ORIGINAL_RAW)

        const req = mockRequest(UPDATED_BODY)
        const res = await editPostBySlug(req, {
            pathParams: { slug: "non-existent" },
        })
        const text = await res.text()

        const parsedText = JSON.parse(text)

        assertEquals(res.status, 404)
        assertEquals(parsedText?.error, "Post not found")
    })

    Deno.test("editPostBySlug: returns 400 for invalid slug", async () => {
        const req = mockRequest({ title: "!!!", content: ORIGINAL_RAW })
        const res = await editPostBySlug(req, {
            pathParams: { slug: "!!!" },
        })
        const text = await res.text()

        const parsedText = JSON.parse(text)

        assertEquals(res.status, 400)
        assertEquals(parsedText?.error, "Invalid slug")
    })

    Deno.test("editPostBySlug: returns 400 for missing content", async () => {
        const req = mockRequest({ title: TEST_SLUG, content: "" })
        const res = await editPostBySlug(req, {
            pathParams: { slug: TEST_SLUG },
        })
        const text = await res.text()

        const parsedText = JSON.parse(text)

        assertEquals(res.status, 400)
        assertEquals(parsedText?.error, "Content missing")
    })
}
