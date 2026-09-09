# ⚡ QueryQuest — Interactive SQL Learning Platform

> **"Learn SQL interactively — DDL, DML, DQL, TCL and real queries, all in your browser. No setup required."**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-6366F1?style=for-the-badge&logo=vercel)](https://queryquest.vercel.app)
[![Deploy to Netlify](https://img.shields.io/badge/Deploy-Netlify-00C7B7?style=for-the-badge&logo=netlify)](https://app.netlify.com/start/deploy?repository=https://github.com/SagarSahoo31/QueryQuest)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

A **mobile-first web application** that teaches SQL through gamified progressive lessons and a fully interactive SQL sandbox — powered by SQLite compiled to WebAssembly (sql.js), running entirely in the browser.

---

## ✨ Features

### 📖 SQL Concepts — Five Categories
Learn the full SQL language organized by category:

| Category | Full Name | Commands |
|---|---|---|
| **DDL** | Data Definition Language | `CREATE`, `ALTER`, `DROP`, `TRUNCATE`, `RENAME` |
| **DML** | Data Manipulation Language | `INSERT`, `UPDATE`, `DELETE`, `MERGE` |
| **DQL** | Data Query Language | `SELECT`, `WHERE`, `JOIN`, `GROUP BY`, `HAVING`, `ORDER BY`, `LIMIT` |
| **TCL** | Transaction Control Language | `BEGIN`, `COMMIT`, `ROLLBACK`, `SAVEPOINT` |
| **DCL** | Data Control Language | `GRANT`, `REVOKE` |

Each category card is expandable with descriptions and live syntax examples.

### 📚 Gamified SQL Journey
- **Progressive Curriculum (Levels 0–8)**: Covers Database Fundamentals → SELECT → WHERE → Aggregates → GROUP BY → JOINs → Subqueries → DDL → DML
- **Active Recall Workflow**: `Learn → Predict → Practice → Execute → Feedback`
- **Gamification**: Earn XP, build daily streaks 🔥, unlock achievements, track topic mastery

### 💻 Interactive SQL Lab — Real SQLite in the Browser
Powered by **sql.js** (SQLite → WebAssembly) — all queries run locally, no server needed:

| Operation | Example |
|---|---|
| **SELECT** | `SELECT * FROM students WHERE cgpa >= 8.0;` |
| **CREATE TABLE** | `CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, price NUMERIC);` |
| **INSERT** | `INSERT INTO products VALUES (1, 'Laptop', 999);` |
| **UPDATE** | `UPDATE products SET price = 899 WHERE id = 1;` |
| **DELETE** | `DELETE FROM products WHERE price < 100;` |
| **DROP TABLE** | `DROP TABLE products;` |
| **ALTER TABLE** | `ALTER TABLE products ADD COLUMN category TEXT;` |

**Two workspace modes in the sidebar:**
- **📚 Sample DB** — preloaded College Database (`students`, `departments`, `courses`, `enrollments`, `professors`)
- **🛠️ My Workspace** — create and manage your own tables with the built-in table wizard

### 🏆 SQL Challenges
Practice with real-world database problems ranging from Beginner to Advanced, including DDL challenges.

---

## 🏗️ Architecture

QueryQuest is a **pure static web app** — a single HTML file with embedded CSS and JavaScript:

```
QueryQuest/
├── apps/
│   └── admin/
│       └── index.html      ← The entire web application (HTML + CSS + JS)
├── api/                    ← Optional NestJS backend (not required for the web app)
├── vercel.json             ← Vercel static site config
├── netlify.toml            ← Netlify static site config
└── package.json
```

**Tech used in the web app:**
- **Vanilla HTML/CSS/JS** — zero frameworks, zero build step
- **[sql.js](https://sql.js.org/)** — SQLite compiled to WebAssembly via CDN
- **[JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono)** + **[Inter](https://fonts.google.com/specimen/Inter)** — Google Fonts

---

## 🚀 Getting Started

### Option 1 — Open directly (no setup)
Just open `apps/admin/index.html` in any modern browser:
```
QueryQuest/apps/admin/index.html
```

### Option 2 — Serve locally
```bash
# Using Python
python -m http.server 8080 --directory apps/admin

# Or npx serve
npx serve apps/admin
```
Then open `http://localhost:8080`

---

## ☁️ Deployment

### Deploy to Vercel (Recommended)
1. Import the repository on **[Vercel](https://vercel.com)**
2. No configuration needed — `vercel.json` is already set up
3. Click **Deploy** ✅

### Deploy to Netlify
1. Connect your repository on **[Netlify](https://netlify.com)**
2. No configuration needed — `netlify.toml` is already set up
3. Click **Deploy** ✅

The app is a **zero-build static site** — no environment variables, no backend, no database server required.

---

## 📱 Mobile-First Design

QueryQuest is designed **mobile-first**:
- Bottom navigation bar (native app feel)
- Touch-optimized tap targets (48px minimum)
- SQL keyword toolbar above the keyboard
- Responsive layout that scales gracefully to desktop
- `safe-area-inset` support for notched phones

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.

---

<p align="center">
  <i>Built with ❤️ by <a href="https://www.linkedin.com/in/sagar-sahoo-777918339/">Sagar Sahoo</a> — because my sister asked for it! ✨</i>
</p>
