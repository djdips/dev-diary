import { authFetch } from "./api.js"
import { loadPostForEdit, showPost } from "./postUtils.js"

export function initSearch() {
    const searchInput = document.getElementById("search-input")
    const postsList = document.getElementById("posts")

    searchInput?.addEventListener("input", async () => {
        const query = searchInput.value.trim()
        if (!query) {
            document.dispatchEvent(new Event("posts:reload"))
            return
        }

        const res = await authFetch(`/search?q=${encodeURIComponent(query)}`)
        const slugs = await res.json()
        postsList.innerHTML = ""

        slugs.forEach(slug => {
            const li = document.createElement("li")
            li.textContent = slug
            li.onclick = () => showPost(slug) // This can be extracted from posts.js as a shared util
            postsList.appendChild(li)
        })
    })

    document.addEventListener("posts:edit", e => {
        const { slug } = e.detail
        loadPostForEdit(slug)
    })
}
