import {
    assertEquals,
    assertMatch,
} from "https://deno.land/std@0.224.0/assert/mod.ts"
import { fileStorage } from "../../lib/storage/fileStorage.ts"

const TEST_SLUG = "test-post"
const TEST_CONTENT = `---
title: Test Post
date: 2025-07-07
tags: [test]
---
This is a test post.
`

Deno.test("fileStorage: savePost and getPost", async () => {
    await fileStorage.savePost(TEST_SLUG, TEST_CONTENT)
    const content = await fileStorage.getPost(TEST_SLUG)
    assertMatch(content!, /This is a test post/)
})

Deno.test("fileStorage: listSlugs includes saved slug", async () => {
    const slugs = await fileStorage.listSlugs()
    assertEquals(slugs.includes(TEST_SLUG), true)
})

Deno.test("fileStorage: getMetadata returns parsed data", async () => {
    const metadata = await fileStorage.getMetadata(TEST_SLUG)
    assertEquals(metadata?.title, "Test Post")
})

Deno.test("fileStorage: deletePost removes the file", async () => {
    await fileStorage.deletePost(TEST_SLUG)
    const content = await fileStorage.getPost(TEST_SLUG)
    assertEquals(content, null)
})
