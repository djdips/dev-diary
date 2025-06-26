import { authFetch } from "./api.js"
import { showLoading, showError } from "./helpers.js"
import { showPost, loadPostForEdit } from "./postUtils.js"

export function initPosts() {
    const postsList = document.getElementById("posts")
    const postView = document.getElementById("post-view")
    const backButton = document.getElementById("back-button")
    const postsListWrapper = document.getElementById("posts-list")

    async function fetchPosts() {
        showLoading(true)
        try {
            const res = await authFetch("/posts")
            if (!res.ok) throw new Error("Unable to fetch posts")

            const slugs = await res.json()
            postsList.innerHTML = ""

            slugs.forEach(slug => {
                const li = document.createElement("li")
                li.textContent = slug
                li.classList.add("post-item")
                li.onclick = () => showPost(slug)
                postsList.appendChild(li)
            })
        } catch (err) {
            showError("📛 Failed to load posts: " + err.message)
        } finally {
            showLoading(false)
        }
    }

    backButton.onclick = () => {
        postView.style.display = "none"
        postsListWrapper.style.display = "block"
    }

    document.addEventListener("posts:edit", e => {
        const { slug } = e.detail
        loadPostForEdit(slug)
    })

    document.addEventListener("posts:reload", fetchPosts)
    fetchPosts()
}
