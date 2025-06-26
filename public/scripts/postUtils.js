import { authFetch } from "./api.js";
import { showLoading, showError } from "./helpers.js";

/**
 * Displays a post by slug and sets up the edit button
 */
export async function showPost(slug) {
  const postView = document.getElementById("post-view");
  const postsListWrapper = document.getElementById("posts-list");

  showLoading(true);
  try {
    const res = await authFetch(`/post/${slug}`);
    if (!res.ok) throw new Error("Post not found");

    const html = await res.text();
    document.getElementById("post-content").innerHTML = html;

    postView.style.display = "block";
    postsListWrapper.style.display = "none";

    const editBtn = document.getElementById("edit-button");
    editBtn.onclick = () => {
      // Decoupled: emits an event so anyone listening can handle edit
      document.dispatchEvent(new CustomEvent("posts:edit", { detail: { slug } }));
    };
  } catch (err) {
    showError("📛 Failed to load post: " + err.message);
  } finally {
    showLoading(false);
  }
}

/**
 * Loads post content into the editor form for editing
 */
export async function loadPostForEdit(slug) {
  const postView = document.getElementById("post-view");
  const editor = document.getElementById("create-post");

  showLoading(true);
  try {
    const res = await authFetch(`/post/${slug}`);
    if (!res.ok) throw new Error("Failed to load post for editing");

    const content = await res.text();
    document.getElementById("title").value = slug;
    document.getElementById("content").value = content;
    document.getElementById("post-form").dataset.editing = slug;

    document.getElementById("content").dispatchEvent(new Event("input"));

    postView.style.display = "none";
    editor.style.display = "block";
  } catch (err) {
    showError("📛 Failed to load post for editing: " + err.message);
  } finally {
    showLoading(false);
  }
}
