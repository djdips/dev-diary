import { initEditor } from "./editor.js"
import { initPosts } from "./posts.js"
import { initSearch } from "./search.js"
import { initAuth, setupLogin, setupLogout, toggleAuthUI } from "./auth.js"
import { initThemeToggle } from "./theme.js"

addEventListener("DOMContentLoaded", () => {
    setupLogin()
    setupLogout()

    initAuth()

    initEditor()
    initPosts()
    initSearch()
    initThemeToggle() // sets up theme toggle button
})
