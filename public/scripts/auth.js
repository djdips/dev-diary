import { showLoading, showError, showSuccess } from "./helpers.js"

export function setupLogin() {
    const loginForm = document.getElementById("login-form")
    const loginMsg = document.getElementById("login-msg")

    loginForm.addEventListener("submit", async e => {
        e.preventDefault()

        loginMsg.textContent = ""
        showLoading(true)

        const username = document.getElementById("login-username").value.trim()
        const password = document.getElementById("login-password").value

        try {
            const res = await fetch("/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            })

            if (res.ok) {
                const { token } = await res.json()
                localStorage.setItem("devdiary_token", token)
                toggleAuthUI(true)
                showSuccess("Login successful!")
                scheduleTokenRefresh()
            } else if (res.status === 401) {
                showError("Invalid username or password")
            } else {
                showError("Login failed, please try again.")
            }
        } catch (err) {
            showError("Login error: " + err.message)
        } finally {
            showLoading(false)
        }
    })
}

export function setupLogout() {
    const logoutBtn = document.getElementById("logout-button")
    logoutBtn.addEventListener("click", () => {
        logoutUser()
    })
}

export function toggleAuthUI(isLoggedIn) {
    document.getElementById("login-section").style.display = isLoggedIn
        ? "none"
        : "block"
    document.getElementById("create-post").style.display = isLoggedIn
        ? "block"
        : "none"
    document.getElementById("logout-button").style.display = isLoggedIn
        ? "inline-block"
        : "none"
}

let refreshTimeout

export function scheduleTokenRefresh() {
    clearTimeout(refreshTimeout)

    refreshTimeout = setTimeout(async () => {
        const token = localStorage.getItem("devdiary_token")
        if (!token) return

        try {
            const res = await fetch("/refresh-token", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            })

            if (res.ok) {
                const { token: newToken } = await res.json()
                localStorage.setItem("devdiary_token", newToken)
                scheduleTokenRefresh()
                showSuccess("Session refreshed!")
            } else {
                logoutUser()
            }
        } catch {
            logoutUser()
        }
    }, (15 - 1) * 60 * 1000) // 14 minutes
}

function logoutUser() {
    localStorage.removeItem("devdiary_token")
    toggleAuthUI(false)
    showError("Session expired or invalid. Please log in again.")
}

export function initAuth() {
  const token = localStorage.getItem("devdiary_token");
  if (token) {
    toggleAuthUI(true);
    scheduleTokenRefresh();
  } else {
    toggleAuthUI(false);
  }
}
