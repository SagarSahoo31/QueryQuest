# QueryQuest - API Specification

## Overview

RESTful API for QueryQuest, versioned under `/api/v1/`.

## Authentication

All authenticated endpoints require a Bearer token:
```
Authorization: Bearer <access_token>
```

## Core Endpoints

### Auth
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/google` - Google OAuth
- `POST /api/v1/auth/guest` - Create guest account
- `POST /api/v1/auth/refresh` - Refresh tokens
- `POST /api/v1/auth/logout` - Logout
- `GET /api/v1/auth/me` - Get current user

### Users
- `GET /api/v1/users/profile` - Get profile
- `PATCH /api/v1/users/profile` - Update profile
- `GET /api/v1/users/stats` - Get statistics

### Courses
- `GET /api/v1/courses` - List courses
- `GET /api/v1/courses/:id` - Get course details
- `GET /api/v1/modules/:id` - Get module with lessons
- `GET /api/v1/lessons/:id` - Get lesson content
- `POST /api/v1/lessons/:id/start` - Start lesson
- `POST /api/v1/lessons/:id/complete` - Complete lesson

### Exercises
- `GET /api/v1/exercises/:id` - Get exercise
- `POST /api/v1/exercises/:id/submit` - Submit answer
- `POST /api/v1/exercises/:id/hint` - Get hint
- `GET /api/v1/exercises/:id/solution` - Get solution

### SQL Execution
- `POST /api/v1/sql/execute` - Execute SQL query
- `GET /api/v1/sql/databases` - List databases
- `GET /api/v1/sql/databases/:id/schema` - Get schema
- `GET /api/v1/sql/history` - Query history
- `POST /api/v1/sql/saved` - Save query
- `GET /api/v1/sql/saved` - Get saved queries

### Gamification
- `GET /api/v1/gamification/profile` - Get gamification data
- `GET /api/v1/gamification/badges` - Get badges
- `GET /api/v1/gamification/leaderboard` - Get leaderboard
- `POST /api/v1/gamification/streak/update` - Update streak

### Challenges
- `GET /api/v1/challenges` - List challenges
- `GET /api/v1/challenges/daily` - Get daily challenge
- `GET /api/v1/challenges/:id` - Get challenge
- `POST /api/v1/challenges/:id/submit` - Submit solution

## Error Format

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "hint": "Optional hint"
  }
}
```

## Rate Limiting

| Endpoint Type | Limit | Window |
|---------------|-------|--------|
| Auth | 10 req | 1 min |
| SQL Execution | 60 req | 1 min |
| General | 100 req | 1 min |
---

<p align="center">
  <strong>Built by <a href="https://www.linkedin.com/in/sagar-sahoo-777918339/">Sagar Sahoo</a></strong>
</p>
<p align="center">
  <a href="mailto:sagarsahoo419@gmail.com">sagarsahoo419@gmail.com</a>
</p>
