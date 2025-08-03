/// <reference lib="dom" />
import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";

Deno.test("Create → Edit → Delete Post", async () => {
  const browser = await puppeteer.launch({ headless: false, executablePath: "/usr/bin/google-chrome", slowMo: 100 });
  const page = await browser.newPage();

  try {
    await page.goto("http://localhost:8000");

    // Wait for login form
    await page.waitForSelector("#login-form", { visible: true });

    // Fill login form
    await page.type("#login-username", "admin");
    await page.type("#login-password", "secret");
    await page.click("#login-form button[type='submit']");

    // Wait for app-ui to appear
    await page.waitForSelector("#app-ui", { timeout: 5000 });

    // Create a post
    await page.waitForSelector("#new-post-btn", { visible: true });
    await page.click("#new-post-btn");
    await page.waitForSelector("#post-form", { visible: true });

    const testTitle = "Integration Test Post";
    const testContent = "## Hello from Puppeteer test 🚀";

    await page.type("#title", testTitle);
    await page.type("#content", testContent);
    await page.click("#post-form button[type='submit']");

    await page.waitForFunction(() =>
      document.querySelector("#success-msg")?.textContent?.includes("✅ Post saved successfully!")
    );

    // Go back to post list
    await page.waitForSelector("#posts-list");

    // Click on the post to view it
    await page.evaluate(() => {
      const slug = "integration-test-post";
      const post = document.querySelector(`.post-item[data-slug="${slug}"]`);
      if (post instanceof HTMLElement) post.click();
    });

    await page.waitForSelector("#post-view");

    // Edit the post
    await page.waitForSelector("#edit-button", { visible: true });
    await page.click("#edit-button");
    await page.waitForSelector("#post-form", { visible: true });

    const updatedContent = "## Edited content ✅";
    await page.evaluate(() => {
      const contentEl = document.querySelector("#content") as HTMLTextAreaElement;
      if (contentEl) contentEl.value = "";
    });
    await page.type("#content", updatedContent);
    await page.click("#post-form button[type='submit']");

    await page.waitForFunction(() =>
      document.querySelector("#success-msg")?.textContent?.includes("✅ Post saved successfully!")
    );

    // Clean-up: delete post using API
    const slug = "integration-test-post";
    const res = await fetch(`http://localhost:8000/api/post/${slug}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer test-token" }, // Update token if required
    });

    await res.body?.cancel();

    console.log("✅ Integration test completed");
  } finally {
    await browser.close();
  }
});