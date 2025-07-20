import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts"
import * as db from "../../lib/storage/dbStorage.ts"

const TEST_SLUG = "db-test"
const RAW = `---
title: DB Test
date: 2025-07-07
tags: [db]
---
Hello DB!`

Deno.test("dbStorage: save and retrieve post", async () => {
    await db.dbStorage.savePost(TEST_SLUG, RAW)
    const raw = await db.dbStorage.getPost(TEST_SLUG)
    assertEquals(typeof raw, "string")
})

Deno.test("dbStorage: listPosts includes test post", async () => {
    const slugs = await db.dbStorage.listSlugs()
    assertEquals(slugs.includes(TEST_SLUG), true)
})

Deno.test("dbStorage: deletePost removes post", async () => {
    await db.dbStorage.deletePost(TEST_SLUG)
    const raw = await db.dbStorage.getPost(TEST_SLUG)
    assertEquals(raw, null)
})
