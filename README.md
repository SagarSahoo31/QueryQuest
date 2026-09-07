# ⚡ QueryQuest — Mobile SQL Learning & Execution Platform

> **"Duolingo meets LeetCode meets a SQL IDE — built specifically for engineering students learning databases."**

![React Native](https://img.shields.io/badge/React_Native-Expo-6366F1?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=for-the-badge&logo=typescript)
![NestJS](https://img.shields.io/badge/NestJS-10.3-E0234E?style=for-the-badge&logo=nestjs)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-5.8-2D3748?style=for-the-badge&logo=prisma)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

A production-ready, mobile-first educational application designed to teach structured query language (SQL) through progressive gamified lessons and a safe, isolated SQL execution playground.

---

## ✨ Features Overview

### 📚 Module A — Gamified SQL Learning
- **Progressive Curriculum (Levels 0–10)**: Covers *Database Fundamentals*, *SELECT & Filtering*, *Aggregate Functions*, *GROUP BY*, *Relational JOINS*, *Subqueries*, *Data Modification (DML)*, *DDL Table Design*, and *Window Functions*.
- **Active Recall Workflow**: Every lesson follows `Learn → Predict → Practice → Execute → Feedback`.
- **Gamification System**: Earn XP, build daily streaks (🔥), unlock badges, and track topic mastery percentages.

### 💻 Module B — Interactive SQL Lab / Mobile IDE
- **Database Explorer**: Inspect preloaded academic datasets (e.g. *College Database* with `students`, `departments`, `courses`, `enrollments`, and `professors`), primary/foreign keys, and sample data.
- **Mobile-First SQL Editor**: Integrated SQL keyword toolbar (`SELECT`, `FROM`, `WHERE`, `JOIN`, `=`, `,`, `;`) positioned above the mobile keyboard for effortless typing.
- **Execution Engine & Metrics**: Instantly run queries with row counts and execution timing (e.g. `4 ms`).
- **Beginner-Friendly Error Interpreter**: Translates cryptic database errors into plain-English explanations with actionable hints and one-tap suggested fixes.
- **Query History & Bookmarks**: Re-run past queries and bookmark frequent snippets.

---

## 🏗️ Architecture & Monorepo Layout

QueryQuest is organized as a high-performance monorepo:

```text
QueryQuest/
├── apps/
│   ├── mobile/           # React Native (Expo) Client App
│   │   ├── src/
│   │   │   ├── components/   # UI components (Header, ResultTable, SQLToolbar, ErrorBanner)
│   │   │   ├── screens/      # HomeScreen, LearnScreen, LessonScreen, SQLLabScreen, ProfileScreen
│   │   │   ├── navigation/   # Root & Tab Navigators
│   │   │   ├── theme/        # Color tokens & dark theme system
│   │   │   └── data/         # Preloaded datasets & client SQL simulator
│   │   └── package.json
│   │
│   └── api/              # NestJS Backend API Service
│       ├── src/
│       │   ├── modules/      # Auth, Courses, Lessons, Exercises, SQL Sandbox, Users
│       │   └── database/     # Prisma ORM client & schema
│       ├── prisma/           # Database migrations & seed scripts
│       ├── vercel.json       # Vercel serverless configuration
│       └── package.json
│
├── docs/                 # Architecture, Database, & API Documentation
└── package.json          # Monorepo workspaces configuration
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `>=18.0.0`
- **npm**: `>=9.0.0`
- **PostgreSQL** *(optional for local API database)*

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/SagarSahoo31/QueryQuest.git
cd QueryQuest
npm install
```

### 2. Run Mobile Application (Expo)
```bash
npm run dev:mobile
```
- Scan the QR code with **Expo Go** (Android / iOS) or press `w` to launch in browser.

### 3. Run Backend API (NestJS)
```bash
npm run dev:api
```
- API Server will start at `http://localhost:3000/api/v1`

---

## ☁️ Deploying Backend API to Vercel

The backend (`apps/api`) is pre-configured for Vercel serverless deployment:

1. Import the repository on **Vercel**.
2. Set the **Root Directory** to `apps/api`.
3. Set Environment Variables in Vercel settings:
   - `DATABASE_URL`: Your PostgreSQL connection string (e.g. Supabase / Neon / Railway)
   - `JWT_SECRET`: Random secure string
4. Click **Deploy**. Vercel will run `prisma generate && nest build` and publish your serverless API endpoints.

---

## 📄 Documentation

- 📐 [Architecture Overview](docs/ARCHITECTURE.md)
- 🗄️ [Database Schema & ERD](docs/DATABASE.md)
- 🔌 [API Specification & Endpoints](docs/API.md)

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more details.

---

<p center>
  <i>Vibe coded because my sister asked for it! ✨ Built by <a href="https://www.linkedin.com/in/sagar-sahoo-777918339/">Sagar Sahoo</a></i>
</p>
