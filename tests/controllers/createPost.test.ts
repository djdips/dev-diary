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

Deno.test("Edge: createPost with special characters in slug", async () => {
    const res = await createPost(
      mockRequest({ title: "Special Slug 🚀", content: "Hello Special Slug!" }),
      { pathParams: { slug: "special-slug_123-🚀" }, queryParams: {} }
    );
  
    assertEquals(res.status, 201);
  });

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

Deno.test("createPost: fileStorage returns 500 if savePost throws", async () => {
  storage.adapter = fileStorage
    const originalSavePost = storage.adapter.savePost

    // Mock savePost to throw an error
    storage.adapter.savePost = () => {
      throw new Error("Simulated failure")
    }
  
    const req = new Request("http://localhost/posts", {
      method: "POST",
      body: JSON.stringify({
        title: "Test Error Post",
        content: "This will trigger a simulated save error.",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
  
    const res = await createPost(req)
    const text = await res.json()
  
    assertEquals(res.status, 500)
    assertEquals(text?.error, "Failed to save post")
  
    // Restore original implementation
    storage.adapter.savePost = originalSavePost
  })

  Deno.test("createPost: dbStorage returns 500 if savePost throws", async () => {
  storage.adapter = dbStorage
  const originalSavePost = storage.adapter.savePost

    // Mock savePost to throw an error
    storage.adapter.savePost = () => {
      throw new Error("Simulated failure")
    }
  
    const req = new Request("http://localhost/posts", {
      method: "POST",
      body: JSON.stringify({
        title: "Test Error Post",
        content: "This will trigger a simulated save error.",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
  
    const res = await createPost(req)
    const text = await res.json()
  
    assertEquals(res.status, 500)
    assertEquals(text?.error, "Failed to save post")
  
    // Restore original implementation
    storage.adapter.savePost = originalSavePost
  })
