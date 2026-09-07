# QueryQuest - Database Schema

## Overview

This document defines the complete database schema for QueryQuest using PostgreSQL and Prisma ORM.

---

## Entity Relationship Diagram

```
                                    ┌─────────────────┐
                                    │     users       │
                                    ├─────────────────┤
                                    │ id (PK)         │
                                    │ email           │
                                    │ password_hash   │
                                    │ google_id       │
                                    │ is_guest        │
                                    │ created_at      │
                                    │ updated_at      │
                                    └────────┬────────┘
                                             │
                     ┌───────────────────────┼───────────────────────┐
                     │                       │                       │
                     ▼                       ▼                       ▼
          ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
          │    profiles     │     │   user_stats    │     │     streaks     │
          ├─────────────────┤     ├─────────────────┤     ├─────────────────┤
          │ user_id (PK,FK) │     │ user_id (PK,FK) │     │ user_id (PK,FK) │
          │ display_name    │     │ total_xp        │     │ current_streak  │
          │ avatar_url      │     │ current_level   │     │ longest_streak  │
          │ experience_level│     │ queries_run     │     │ last_activity   │
          │ learning_goal   │     │ exercises_done  │     │ created_at      │
          │ timezone        │     │ challenges_done │     │ updated_at      │
          │ preferences     │     │ created_at      │     └─────────────────┘
          │ created_at      │     │ updated_at      │
          │ updated_at      │     └─────────────────┘
          └─────────────────┘

┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│    courses      │       │    modules      │       │    lessons      │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │◀──────│ course_id (FK)  │◀──────│ module_id (FK)  │
│ title           │       │ id (PK)         │       │ id (PK)         │
│ slug            │       │ title           │       │ title           │
│ description     │       │ slug            │       │ slug            │
│ difficulty      │       │ description     │       │ description     │
│ order_index     │       │ order_index     │       │ content         │
│ cover_image     │       │ is_locked       │       │ order_index     │
│ is_published    │       │ created_at      │       │ xp_reward       │
│ created_at      │       │ updated_at      │       │ estimated_time  │
│ updated_at      │       └─────────────────┘       │ is_locked       │
└─────────────────┘                                 │ created_at      │
                                                    │ updated_at      │
                                                    └────────┬────────┘
                                                             │
                                                    ┌────────┴────────┐
                                                    │                 │
                                                    ▼                 ▼
                                         ┌─────────────────┐ ┌─────────────────┐
                                         │ lesson_progress │ │    exercises    │
                                         ├─────────────────┤ ├─────────────────┤
                                         │ id (PK)         │ │ id (PK)         │
                                         │ user_id (FK)    │ │ lesson_id (FK)  │
                                         │ lesson_id (FK)  │ │ type            │
                                         │ status          │ │ title           │
                                         │ xp_earned       │ │ description     │
                                         │ started_at      │ │ content         │
                                         │ completed_at    │ │ hints           │
                                         │ attempts        │ │ solution        │
                                         │ created_at      │ │ xp_reward       │
                                         │ updated_at      │ │ difficulty      │
                                         └─────────────────┘ │ order_index     │
                                                             │ created_at      │
                                                             │ updated_at      │
                                                             └────────┬────────┘
                                                                      │
                                                                      ▼
                                                            ┌─────────────────┐
                                                            │exercise_attempts│
                                                            ├─────────────────┤
                                                            │ id (PK)         │
                                                            │ user_id (FK)    │
                                                            │ exercise_id(FK) │
                                                            │ answer          │
                                                            │ is_correct      │
                                                            │ xp_earned       │
                                                            │ hints_used      │
                                                            │ time_spent_ms   │
                                                            │ attempted_at    │
                                                            └─────────────────┘

┌─────────────────┐       ┌─────────────────┐
│     badges      │       │  user_badges    │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │◀──────│ badge_id (FK)   │
│ name            │       │ user_id (FK)    │
│ slug            │       │ earned_at       │
│ description     │       │ metadata        │
│ icon            │       └─────────────────┘
│ category        │
│ requirement     │
│ xp_reward       │
│ order_index     │
│ created_at      │
└─────────────────┘

┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│    datasets     │       │ dataset_tables  │       │  query_history  │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │◀──────│ dataset_id (FK) │       │ id (PK)         │
│ name            │       │ name            │       │ user_id (FK)    │
│ slug            │       │ schema          │       │ dataset_id (FK) │
│ description     │       │ sample_data     │       │ query           │
│ icon            │       │ row_count       │       │ result          │
│ difficulty      │       │ order_index     │       │ is_success      │
│ is_active       │       └─────────────────┘       │ error_code      │
│ order_index     │                                 │ error_message   │
│ created_at      │                                 │ rows_returned   │
│ updated_at      │                                 │ execution_time  │
└─────────────────┘                                 │ executed_at     │
                                                    └─────────────────┘

┌─────────────────┐       ┌─────────────────┐
│  saved_queries  │       │   challenges    │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │
│ user_id (FK)    │       │ title           │
│ dataset_id (FK) │       │ slug            │
│ title           │       │ description     │
│ query           │       │ dataset_id (FK) │
│ description     │       │ difficulty      │
│ is_favorite     │       │ xp_reward       │
│ created_at      │       │ hints           │
│ updated_at      │       │ solution        │
└─────────────────┘       │ is_daily        │
                          │ available_from  │
                          │ available_until │
                          │ created_at      │
                          │ updated_at      │
                          └────────┬────────┘
                                   │
                                   ▼
                         ┌─────────────────┐
                         │challenge_attempts│
                         ├─────────────────┤
                         │ id (PK)         │
                         │ user_id (FK)    │
                         │ challenge_id(FK)│
                         │ query           │
                         │ is_completed    │
                         │ xp_earned       │
                         │ hints_used      │
                         │ time_spent_ms   │
                         │ attempted_at    │
                         └─────────────────┘
```

---

## Prisma Schema

```prisma
// This is your Prisma schema file
// Learn more: https://pris.ly/databse-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================================================
// USER & AUTHENTICATION
// ============================================================================

model User {
  id            String    @id @default(uuid())
  email         String?   @unique
  passwordHash  String?
  googleId      String?   @unique
  isGuest       Boolean   @default(false)
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  profile       Profile?
  stats         UserStats?
  streak        Streak?
  lessonProgress    LessonProgress[]
  exerciseAttempts  ExerciseAttempt[]
  badges            UserBadge[]
  queryHistory      QueryHistory[]
  savedQueries      SavedQuery[]
  challengeAttempts ChallengeAttempt[]

  @@index([email])
  @@index([googleId])
  @@map("users")
}

model Profile {
  userId          String    @id
  displayName     String?
  avatarUrl       String?
  experienceLevel String    @default("beginner") // beginner, some_experience, intermediate
  learningGoal    String?   // college, placements, interviews, projects, personal
  timezone        String    @default("UTC")
  preferences     Json?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  // Relations
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("profiles")
}

model UserStats {
  userId          String    @id
  totalXp         Int       @default(0)
  currentLevel    Int       @default(1)
  queriesRun      Int       @default(0)
  exercisesDone   Int       @default(0)
  challengesDone  Int       @default(0)
  lessonsCompleted Int      @default(0)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  // Relations
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("user_stats")
}

model Streak {
  userId          String    @id
  currentStreak   Int       @default(0)
  longestStreak   Int       @default(0)
  lastActivity    DateTime?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  // Relations
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("streaks")
}

// ============================================================================
// COURSES & LEARNING CONTENT
// ============================================================================

model Course {
  id            String    @id @default(uuid())
  title         String
  slug          String    @unique
  description   String?
  difficulty    String    @default("beginner") // beginner, intermediate, advanced
  orderIndex    Int       @default(0)
  coverImage    String?
  isPublished   Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  modules       Module[]

  @@index([slug])
  @@index([orderIndex])
  @@map("courses")
}

model Module {
  id            String    @id @default(uuid())
  courseId      String
  title         String
  slug          String    @unique
  description   String?
  orderIndex    Int       @default(0)
  isLocked      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  course        Course    @relation(fields: [courseId], references: [id], onDelete: Cascade)
  lessons       Lesson[]

  @@index([courseId])
  @@index([slug])
  @@index([orderIndex])
  @@map("modules")
}

model Lesson {
  id            String    @id @default(uuid())
  moduleId      String
  title         String
  slug          String    @unique
  description   String?
  content       Json      // Structured lesson content
  orderIndex    Int       @default(0)
  xpReward      Int       @default(10)
  estimatedTime Int       @default(5) // minutes
  isLocked      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  module        Module            @relation(fields: [moduleId], references: [id], onDelete: Cascade)
  exercises     Exercise[]
  progress      LessonProgress[]

  @@index([moduleId])
  @@index([slug])
  @@index([orderIndex])
  @@map("lessons")
}

model LessonProgress {
  id            String    @id @default(uuid())
  userId        String
  lessonId      String
  status        String    @default("not_started") // not_started, in_progress, completed
  xpEarned      Int       @default(0)
  startedAt     DateTime?
  completedAt   DateTime?
  attempts      Int       @default(0)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  lesson        Lesson    @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, lessonId])
  @@index([userId])
  @@index([lessonId])
  @@map("lesson_progress")
}

// ============================================================================
// EXERCISES & QUESTIONS
// ============================================================================

enum ExerciseType {
  MULTIPLE_CHOICE
  FILL_BLANK
  QUERY_PREDICTION
  QUERY_WRITING
  DEBUGGING
}

model Exercise {
  id            String        @id @default(uuid())
  lessonId      String
  type          ExerciseType
  title         String
  description   String?
  content       Json          // Exercise-specific content
  hints         Json?         // Array of progressive hints
  solution      String?
  explanation   String?
  xpReward      Int           @default(5)
  difficulty    String        @default("easy") // easy, medium, hard
  orderIndex    Int           @default(0)
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  // Relations
  lesson        Lesson            @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  attempts      ExerciseAttempt[]

  @@index([lessonId])
  @@index([orderIndex])
  @@map("exercises")
}

model ExerciseAttempt {
  id            String    @id @default(uuid())
  userId        String
  exerciseId    String
  answer        Json?
  isCorrect     Boolean   @default(false)
  xpEarned      Int       @default(0)
  hintsUsed     Int       @default(0)
  timeSpentMs   Int?
  attemptedAt   DateTime  @default(now())

  // Relations
  exercise      Exercise  @relation(fields: [exerciseId], references: [id], onDelete: Cascade)
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([exerciseId])
  @@index([attemptedAt])
  @@map("exercise_attempts")
}

// ============================================================================
// GAMIFICATION
// ============================================================================

model Badge {
  id            String    @id @default(uuid())
  name          String
  slug          String    @unique
  description   String
  icon          String?
  category      String    // learning, practice, achievement, streak
  requirement   Json      // Criteria to earn the badge
  xpReward      Int       @default(0)
  orderIndex    Int       @default(0)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  userBadges    UserBadge[]

  @@index([slug])
  @@index([category])
  @@map("badges")
}

model UserBadge {
  id            String    @id @default(uuid())
  userId        String
  badgeId       String
  earnedAt      DateTime  @default(now())
  metadata      Json?

  // Relations
  badge         Badge     @relation(fields: [badgeId], references: [id], onDelete: Cascade)
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, badgeId])
  @@index([userId])
  @@index([badgeId])
  @@map("user_badges")
}

// ============================================================================
// SQL PLAYGROUND
// ============================================================================

model Dataset {
  id            String    @id @default(uuid())
  name          String
  slug          String    @unique
  description   String?
  icon          String?
  difficulty    String    @default("beginner")
  isActive      Boolean   @default(true)
  orderIndex    Int       @default(0)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  tables        DatasetTable[]
  queryHistory  QueryHistory[]
  savedQueries  SavedQuery[]
  challenges    Challenge[]

  @@index([slug])
  @@index([orderIndex])
  @@map("datasets")
}

model DatasetTable {
  id            String    @id @default(uuid())
  datasetId     String
  name          String
  schema        Json      // Column definitions
  sampleData    Json?     // Sample rows for preview
  rowCount      Int       @default(0)
  orderIndex    Int       @default(0)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  dataset       Dataset   @relation(fields: [datasetId], references: [id], onDelete: Cascade)

  @@unique([datasetId, name])
  @@index([datasetId])
  @@index([orderIndex])
  @@map("dataset_tables")
}

model QueryHistory {
  id              String    @id @default(uuid())
  userId          String
  datasetId       String
  query           String    @db.Text
  result          Json?
  isSuccess       Boolean   @default(false)
  errorCode       String?
  errorMessage    String?
  rowsReturned    Int?
  executionTime   Int?      // milliseconds
  executedAt      DateTime  @default(now())

  // Relations
  dataset         Dataset   @relation(fields: [datasetId], references: [id], onDelete: Cascade)
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([datasetId])
  @@index([executedAt])
  @@map("query_history")
}

model SavedQuery {
  id            String    @id @default(uuid())
  userId        String
  datasetId     String?
  title         String
  query         String    @db.Text
  description   String?
  isFavorite    Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  dataset       Dataset?  @relation(fields: [datasetId], references: [id], onDelete: SetNull)
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([datasetId])
  @@index([isFavorite])
  @@map("saved_queries")
}

// ============================================================================
// CHALLENGES
// ============================================================================

model Challenge {
  id            String    @id @default(uuid())
  title         String
  slug          String    @unique
  description   String    @db.Text
  datasetId     String
  difficulty    String    @default("medium")
  xpReward      Int       @default(25)
  hints         Json?
  solution      String    @db.Text
  explanation   String?   @db.Text
  isDaily       Boolean   @default(false)
  availableFrom DateTime?
  availableUntil DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  dataset       Dataset           @relation(fields: [datasetId], references: [id], onDelete: Cascade)
  attempts      ChallengeAttempt[]

  @@index([slug])
  @@index([isDaily])
  @@index([availableFrom])
  @@map("challenges")
}

model ChallengeAttempt {
  id            String    @id @default(uuid())
  userId        String
  challengeId   String
  query         String    @db.Text
  isCompleted   Boolean   @default(false)
  xpEarned      Int       @default(0)
  hintsUsed     Int       @default(0)
  timeSpentMs   Int?
  attemptedAt   DateTime  @default(now())

  // Relations
  challenge     Challenge @relation(fields: [challengeId], references: [id], onDelete: Cascade)
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, challengeId])
  @@index([userId])
  @@index([challengeId])
  @@index([attemptedAt])
  @@map("challenge_attempts")
}
```

---

## Lesson Content Structure

The `content` field in the Lesson model stores structured JSON:

```typescript
interface LessonContent {
  sections: LessonSection[];
}

interface LessonSection {
  type: 'explanation' | 'example' | 'diagram' | 'table' | 'code';
  title?: string;
  content: string | CodeBlock | TableData | DiagramData;
}

interface CodeBlock {
  language: 'sql';
  code: string;
  explanation?: string;
  result?: QueryResult;
}

interface TableData {
  headers: string[];
  rows: string[][];
  caption?: string;
}
```

---

## Exercise Content Structures

### Multiple Choice

```typescript
interface MultipleChoiceContent {
  question: string;
  code?: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  explanation: string;
}
```

### Fill in the Blank

```typescript
interface FillBlankContent {
  template: string; // "SELECT ___ FROM students WHERE ___ = 'CSE'"
  blanks: {
    id: string;
    correctAnswer: string;
    acceptableAnswers?: string[];
    hint?: string;
  }[];
  explanation: string;
}
```

### Query Prediction

```typescript
interface QueryPredictionContent {
  query: string;
  tables: {
    name: string;
    data: Record<string, unknown>[];
  }[];
  options: {
    id: string;
    result: Record<string, unknown>[]; // The result set
    isCorrect: boolean;
  }[];
  explanation: string;
}
```

### Query Writing

```typescript
interface QueryWritingContent {
  instruction: string;
  datasetId: string;
  tables: string[]; // Available tables
  expectedResult?: {
    columns: string[];
    sampleRows: unknown[][];
  };
  validationType: 'exact' | 'columns' | 'semantics';
  forbiddenKeywords?: string[];
  requiredKeywords?: string[];
}
```

### Debugging

```typescript
interface DebuggingContent {
  buggyQuery: string;
  error?: {
    message: string;
    line?: number;
  };
  expectedBehavior: string;
  hint?: string;
  solution: string;
  explanation: string;
}
```

---

## Database Indexes Strategy

### Performance Indexes

| Table | Index | Purpose |
|-------|-------|---------|
| users | email | Fast login lookup |
| users | google_id | OAuth lookup |
| courses | slug | URL routing |
| modules | course_id, order_index | Module ordering |
| lessons | module_id, order_index | Lesson ordering |
| lesson_progress | user_id, lesson_id | Progress lookup |
| exercises | lesson_id, order_index | Exercise ordering |
| exercise_attempts | user_id, attempted_at | History queries |
| query_history | user_id, executed_at | History pagination |
| challenges | is_daily, available_from | Daily challenge lookup |

---

## Data Migrations

### Migration Strategy

1. Use Prisma Migrate for schema changes
2. Seed scripts for initial data
3. Zero-downtime migrations for production
4. Backward-compatible changes when possible

### Initial Seed Data

1. **Courses**: SQL Fundamentals, Intermediate SQL
2. **Modules**: Database Basics, SELECT, WHERE, etc.
3. **Lessons**: ~50 lessons for MVP
4. **Exercises**: ~150 exercises
5. **Badges**: 15 initial badges
6. **Datasets**: College Database (primary)
---

<p align="center">
  <strong>Built by <a href="https://www.linkedin.com/in/sagar-sahoo-777918339/">Sagar Sahoo</a></strong>
</p>
<p align="center">
  <a href="mailto:sagarsahoo419@gmail.com">sagarsahoo419@gmail.com</a>
</p>
