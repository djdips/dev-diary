import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { fileStorage } from "../../lib/storage/fileStorage.ts";
import { dbStorage } from "../../lib/storage/dbStorage.ts";
import { getPostMeta } from "../../controllers/getPostMeta.ts";
import { storage } from "../../lib/storage/index.ts";

const TEST_TAG = "filter-test";
const SLUG1 = "filter-tag-1";
const SLUG2 = "filter-tag-2";
const RAW_1 = `---
  title: Tag Post 1
  date: 2025-07-10
  tags: ["${TEST_TAG}", "extra"]
---
Hello 1!`;

const RAW_2 = `---
  title: Tag Post 2
  date: 2025-07-11
  tags: ["random"]
---
Hello 2!`;

// Helper to mock a request
function mockRequest(): Request {
    return new Request("http://localhost/post", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
}

async function runTests(adapterName: string, adapter: typeof storage.adapter) {
    Deno.test(`getPostMeta: returns posts with matching tag (${adapterName})`, async () => {
        storage.adapter = adapter;

        // Save the test posts
        await adapter.savePost(SLUG1, RAW_1);
        await adapter.savePost(SLUG2, RAW_2);

        const req = mockRequest(); // no need for body here
        const res = await getPostMeta(req, {
            pathParams: { slug: SLUG1 },
            queryParams: {},
        });

        const metadata = await res.json();

        assertEquals(metadata.title, "Tag Post 1");
        assertEquals(metadata.date, "2025-07-10T00:00:00.000Z");
        assertEquals(metadata.tags, [TEST_TAG, "extra"]);
    });

    Deno.test(`getPostMeta: returns 404 for unmatched tag (${adapterName})`, async () => {
        const req = mockRequest();

        const res = await getPostMeta(req, {
            queryParams: {},
            pathParams: { slug: "nope" },
        });
        assertEquals(res.status, 404);
    });
}

await runTests("fileStorage", fileStorage);
await runTests("dbStorage", dbStorage);
