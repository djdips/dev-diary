# 📝 DevDiary

A simple Markdown blog engine built with **Deno**, supporting YAML frontmatter metadata, tag-based filtering, and a minimal frontend interface.

## 🚀 Features

- 📄 Create and read Markdown blog posts  
- 🧠 Supports frontmatter metadata via YAML (`title`, `date`, `tags`)  
- 🏷 Filter posts by tag via API  
- 🌐 Serve static HTML, CSS, and JS frontend  
- 📦 Fully modular TypeScript backend with route controllers  

## 🗂️ Project Structure

```
dev-diary/
├── controllers/ # API logic per route
│ ├── createPost.ts
│ ├── deletePost.ts
│ ├── getPost.ts
│ ├── getPostMeta.ts
│ ├── getPostsByTag.ts
│ └── listPosts.ts
│
├── public/ # Static frontend files
│ ├── index.html
│ ├── styles.css
│ └── script.js
│
├── posts/ # Markdown blog posts
│
├── routes.ts # Route definitions and request matching
├── deps.ts # All external imports centralized
├── mod.ts # Main server entry point
│
├── utils/ # Reusable helpers
│ ├── parseFrontmatter.ts
│ └── validateMetadata.ts
│
├── README.md
└── .gitignore
```

## 📦 Tech Stack

- **Deno** — secure, modern runtime with native TypeScript  
- **Marked** — for Markdown to HTML conversion  
- **js-yaml** — to parse YAML frontmatter  
- **Vanilla JS** — minimal frontend (no frameworks)  

## ⚙️ Requirements

- [Deno](https://deno.land/) v1.40+ installed

## 🏃‍♂️ Getting Started

1. **Clone the repository**

```
git clone https://github.com/your-username/dev-diary.git
cd dev-diary
```

2. **Run the server**

```
deno run --allow-net --allow-read --allow-write mod.ts
```

3. **Open the app**

```
Visit http://localhost:8000 in your browser.
```

## ✍️ Writing a Post

Create a `.md` file inside the `posts/` directory. Example:

```markdown
---
title: Hello Deno
date: 2025-06-25
tags:
  - deno
  - typescript
---

This is your first DevDiary post!

It supports **Markdown** and `code blocks`.

## 🧪 API Endpoints

- `GET /posts` → List all post slugs  
- `GET /post/:slug` → Render full HTML content  
- `GET /post/:slug/meta` → Return metadata (title, date, tags)  
- `GET /tag/:tagName` → Posts filtered by tag  
- `POST /post` → Create new post (expects JSON: `{ title, content }`)  
- `DELETE /post/:slug` → Delete a post by slug  

## 🧹 .gitignore

```gitignore
.DS_Store
*.log
node_modules/
.env
```

## 📄 License

```
MIT License
```