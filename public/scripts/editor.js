import { authFetch } from "./api.js"
import { showLoading, showSuccess, showError } from "./helpers.js" // assuming these are exported from a common module

export function initEditor() {
    const contentInput = document.getElementById("content")
    const previewDiv = document.getElementById("markdown-preview")
    const form = document.getElementById("post-form")

    // Live preview
    contentInput?.addEventListener("input", () => {
        previewDiv.innerHTML = marked.parse(contentInput.value)
    })

    form?.addEventListener("submit", async e => {
        e.preventDefault()

        const slug = document.getElementById("title").value.trim()
        const content = document.getElementById("content").value.trim()
        const isEdit = form.dataset.editing
        const method = isEdit ? "PUT" : "POST"
        const endpoint = isEdit ? `/post/${slug}` : "/post"

        if (!slug || !content) {
            showError("Title and content are required.")
            return
        }

        try {
            showLoading(true)

            const res = await authFetch(endpoint, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: slug, content }),
            })

            if (res.ok) {
                form.reset()
                form.removeAttribute("data-editing")
                previewDiv.innerHTML = ""
                showSuccess("✅ Post saved successfully!")
                document.dispatchEvent(new CustomEvent("posts:reload"))
            } else {
                showError("❌ Failed to save post.")
            }
        } catch (err) {
            showError("❌ Error saving post: " + err.message)
        } finally {
            showLoading(false)
        }
    })
}
