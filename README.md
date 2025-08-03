![Deno CI](https://github.com/djdips/dev-diary/actions/workflows/ci.yml/badge.svg)
![Coverage](https://img.shields.io/badge/coverage-72%25-yellowgreen)

# DevDiary 📝 – Markdown Blog Engine (Deno + TypeScript)

A simple yet powerful Markdown blog engine built using Deno and TypeScript. Supports file or DB storage, JWT-based authentication, and a clean API layer.

---

## 📦 Features

- 📝 Markdown-based blogging with YAML frontmatter
- 🗂️ Toggle between file or DB storage (via `.env`)
- 🔒 Token-based authentication (login, protected routes)
- 🔍 Tag-based filtering and basic search
- 🧪 Unit tests with ~72%+ coverage
- 🛠️ Built-in CLI migration tool
- ☯️ Dark/light mode (frontend)
- 🧩 Modular architecture (controllers, middleware, utils)

---

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

## 🚀 Getting Started

## 1. Clone the repo

```bash
git clone https://github.com/djdips/dev-diary.git
cd dev-diary
```

## 2. Set up environment (optional)

Create a .env file:

```bash
STORAGE_BACKEND=file  # or "db"
POSTS_DIR=posts
```
If no .env is found, fileStorage will be used by default.

### 3. Run the server

```bash
npm run start
```
The server will start at http://localhost:8000 by default.

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

## 📁 Storage Backends

You can toggle storage backend via .env or config.ts.

File Storage
Stores blog posts as .md files under posts/.

DB Storage
Stores posts in SQLite using deno-kv (or custom backend).

Use the migration script to convert from file → db:

```bash
npm run migrate
```

## 🧪 Testing & Coverage
Run all tests:

```bash
npm run test
```

Generate coverage report:

```bash
npm run coverage
```
Creates a full HTML report under coverage/html/.

## 🛠️ API Endpoints
```
| Method | Endpoint            | Description             | Auth  |
| ------ | ------------------- | ----------------------- | ----  |
| GET    | `/posts`            | Get all posts           | ❌    |
| GET    | `/posts/:slug`      | Get a post by slug      | ❌    |
| POST   | `/posts`            | Create a new post       | ✅    |
| PUT    | `/posts/:slug`      | Edit existing post      | ✅    |
| DELETE | `/posts/:slug`      | Delete a post           | ✅    |
| GET    | `/tag/:tagName`     | Filter posts by tag     | ❌    |
| GET    | `/search?q=keyword` | Search posts (optional) | ❌    |
| POST   | `/login`            | Login and get token     | ❌    |

```
   > 🔐 Protected routes require:
   > Authorization: Bearer <token>
```
```

## 🧑‍💻 Contribution Guide
We welcome contributions!

Steps:
1. Fork and clone the repo
2. Create a feature branch (git checkout -b feature-x)
3. Run tests (deno task test)
4. Format code (deno fmt && deno lint)
5. Open a pull request 🚀

## 📄 License
MIT © 2025 – Dipen Shah
github.com/djdips/dev-diary