// tests/utils/parseMetadata.test.ts
import { assert, assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts"
import { parseMetadata } from "../../utils/parseMetadata.ts"

Deno.test("parseMetadata returns metadata and content", () => {
    const raw = `---
title: My First Post
date: 2025-06-27
tags:
  - test
  - dev
---

Hello world!`

    const result = parseMetadata(raw)

    // Check content is parsed correctly
    assertEquals(result.content.trim(), "Hello world!")

    // Check metadata keys
    assert("title" in result.metadata)
    assert("date" in result.metadata)
    assert("tags" in result.metadata)

    // Check title
    assertEquals(result.metadata.title, "My First Post")

    // Check tags as array
    assertEquals(result.metadata.tags, ["test", "dev"])

    // Check date is ISO string
    const date = result.metadata.date
    assert(typeof date === "string")
    assert(date.endsWith("T00:00:00.000Z"))

    // Optional: check if the date string is valid ISO date
    const parsedDate = new Date(date)
    assert(!isNaN(parsedDate.getTime()))
})

Deno.test("parseMetadata handles missing metadata", () => {
    const raw = `# No frontmatter\n\nJust content.`

    const { metadata, content } = parseMetadata(raw)

    assertEquals(metadata, {})
    assertEquals(content.includes("Just content."), true)
})

Deno.test("parseMetadata handles empty input", () => {
    const raw = ``

    const { metadata, content } = parseMetadata(raw)

    assertEquals(metadata, {})
    assertEquals(content, "")
})
