const postsList = document.getElementById("posts");
const postView = document.getElementById("post-view");
const postContent = document.getElementById("post-content");
const backButton = document.getElementById("back-button");

async function fetchPosts() {
  const res = await fetch("/posts");
  const posts = await res.json();
  postsList.innerHTML = "";
  posts.forEach((slug) => {
    const li = document.createElement("li");
    li.textContent = slug;
    li.onclick = () => showPost(slug);
    postsList.appendChild(li);
  });
}

async function showPost(slug) {
  const res = await fetch(`/post/${slug}`);
  if (!res.ok) {
    postContent.innerHTML = "<p>Post not found.</p>";
  } else {
    const html = await res.text();
    postContent.innerHTML = html;
  }
  document.getElementById("posts-list").style.display = "none";
  postView.style.display = "block";
}

backButton.onclick = () => {
  postView.style.display = "none";
  document.getElementById("posts-list").style.display = "block";
};

globalThis.onload = () => {
  fetchPosts();
};
