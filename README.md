# 📝 DevDiary – Markdown Blog API in Deno

DevDiary is a lightweight, file-based blog engine built with **Deno** that lets you write and serve blog posts written in **Markdown**. It exposes a clean REST API to list, fetch, create, and delete posts — no database required.

---

## 🚀 Features

- ⚡ Fast and simple REST API
- 📄 Markdown to HTML conversion using [`marked`](https://marked.js.org/)
- 🗂️ File-based post storage (`posts/`)
- 🛠️ Built with modern **Deno**
- 🔐 Secure by default (requires permissions to read/write files)
- ☁️ Easy to deploy (no DB, runs anywhere)

---

## 📦 Project Structure

```
dev-diary-deno/
├── posts/              # Markdown files stored as posts
├── mod.ts              # Entry point (Deno HTTP server)
├── routes.ts           # API logic (GET/POST/DELETE)
├── deps.ts             # Imported dependencies
└── README.md
```

---

## 🧪 API Endpoints

### `GET /posts`
List all available blog posts (by slug).

**Response:**
```json
["hello-world", "my-first-post"]
```

---

### `GET /post/:slug`
Get a specific post rendered as HTML.

**Example:**  
`GET /post/hello-world`

**Response:**  
HTML content rendered from `posts/hello-world.md`

---

### `POST /post`
Create a new post.

**Request:**
```json
{
  "title": "My First Post",
  "content": "# Hello\nThis is my first post!"
}
```

**Response:**
```json
{
  "message": "Post created",
  "slug": "my-first-post"
}
```

---

### `DELETE /post/:slug`
Delete a post.

**Response:**
```json
{
  "message": "Post deleted",
  "slug": "my-first-post"
}
```

---

## 🛠️ Running the Project

### 🔧 Permissions Required:
```bash
deno run --allow-net --allow-read --allow-write mod.ts
```

> Deno is secure by default. We explicitly allow network and file access.

---

## 🧱 Example Markdown File

**`posts/hello-world.md`**
```md
# Hello World

Welcome to **DevDiary**!

This is your first post.
```

---

## 📌 TODO

- [ ] Add frontmatter metadata (tags, date)
- [ ] Filter posts by tag
- [ ] Render summary previews
- [ ] Optional: Serve static blog frontend

---

## 👨‍💻 Author

**Dipen Shah**  
Building clean, cross-platform tools using modern stacks.  
[GitHub Profile »](https://github.com/your-username)

---

## 📄 License

MIT

---

## 💡 Tip

Use it as a headless backend for your SSG/Next.js blog or a minimal portfolio!
