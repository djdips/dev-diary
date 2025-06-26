const postsList = document.getElementById("posts")
const postView = document.getElementById("post-view")
const postContent = document.getElementById("post-content")
const backButton = document.getElementById("back-button")
const postForm = document.getElementById("post-form")
const formMsg = document.getElementById("form-msg")

function loadPostForEdit(slug) {
  fetch(`/post/${slug}`)
    .then(res => res.text())
    .then(content => {
      document.getElementById("title").value = slug; // assuming slug is title
      document.getElementById("content").value = content;
      document.getElementById("post-form").dataset.editing = slug;

      // Trigger preview
      const event = new Event("input");
      document.getElementById("content").dispatchEvent(event);

      // Show form, hide post view
      document.getElementById("post-view").style.display = "none";
      document.getElementById("create-post").style.display = "block";
    });
}


async function fetchPosts(tag = null) {
    const res = tag ? await fetch(`/tag/${tag}`) : await fetch("/posts")

    const posts = await res.json()
    postsList.innerHTML = ""

    posts.forEach(slug => {
        const li = document.createElement("li")
        li.innerHTML = `<span class="post-title">${slug}</span>`
        li.onclick = () => showPost(slug)
        postsList.appendChild(li)
    })

    highlightActiveTag(tag)
}

async function showPost(slug) {
    const res = await fetch(`/post/${slug}`)
    const metaRes = await fetch(`/post/${slug}/meta`)
    const meta = await metaRes.json()

    if (!res.ok) {
        postContent.innerHTML = "<p>Post not found.</p>"
    } else {
        const html = await res.text()
        postContent.innerHTML = `
      <div>${html}</div>
      <div id="post-tags" style="margin-top: 1rem;"></div>
    `

        if (Array.isArray(meta.tags)) {
            const tagContainer = document.getElementById("post-tags")
            tagContainer.innerHTML =
                `<strong>Tags:</strong> ` +
                meta.tags
                    .map(
                        tag =>
                            `<button class="tag-button" data-tag="${tag}">${tag}</button>`
                    )
                    .join(" ")

            // Add click listeners
            document.querySelectorAll(".tag-button").forEach(btn => {
                btn.addEventListener("click", () => {
                    fetchPosts(btn.dataset.tag)
                    backButton.click()
                })
            })
        }
    }

    document.getElementById("posts-list").style.display = "none"
    document.getElementById("create-post").style.display = "none"
    postView.style.display = "block"

    const editButton = document.getElementById("edit-button")
    editButton.onclick = () => loadPostForEdit(slug)
}

backButton.onclick = () => {
    postView.style.display = "none"
    document.getElementById("posts-list").style.display = "block"
    document.getElementById("create-post").style.display = "block"
    formMsg.textContent = ""
}

document.getElementById("post-form").onsubmit = async (e) => {
  e.preventDefault();

  const slug = document.getElementById("title").value.trim();
  const content = document.getElementById("content").value.trim();
  const isEdit = e.target.dataset.editing;

  const method = isEdit ? "PUT" : "POST";
  const endpoint = isEdit ? `/post/${isEdit}` : "/post";

  const res = await fetch(endpoint, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: slug, content }),
  });

  if (res.ok) {
    e.target.reset();
    delete e.target.dataset.editing;
    document.getElementById("markdown-preview").innerHTML = "";
    fetchPosts(); // refresh post list
    document.getElementById("create-post").style.display = "none";
    document.getElementById("posts-list").style.display = "block";
  } else {
    document.getElementById("form-msg").textContent = "Failed to save post.";
  }
};

const activeTagLabel = document.getElementById("active-tag")
const clearTagBtn = document.getElementById("clear-tag")

function highlightActiveTag(tag) {
    if (tag) {
        activeTagLabel.textContent = `Filtered by tag: ${tag}`
        clearTagBtn.style.display = "inline-block"
    } else {
        activeTagLabel.textContent = ""
        clearTagBtn.style.display = "none"
    }
}

clearTagBtn.onclick = () => {
    fetchPosts()
}

const contentInput = document.getElementById("content")
const previewDiv = document.getElementById("markdown-preview")

contentInput.addEventListener("input", () => {
    const markdown = contentInput.value
    previewDiv.innerHTML = marked.parse(markdown)
})

const searchInput = document.getElementById("search-input")

searchInput.addEventListener("input", async () => {
    const query = searchInput.value.trim()
    if (query.length === 0) {
        fetchPosts() // show all posts if search is cleared
    } else {
        const res = await fetch(`/search?q=${encodeURIComponent(query)}`)
        const posts = await res.json()
        postsList.innerHTML = ""

        posts.forEach(slug => {
            const li = document.createElement("li")
            li.textContent = slug
            li.onclick = () => showPost(slug)
            postsList.appendChild(li)
        })

        highlightActiveTag(null) // clear any tag filters
    }
})

globalThis.onload = () => {
    fetchPosts()
}
