# QueryQuest - System Architecture

## 1. Product Overview

QueryQuest is a mobile-first educational application for learning and practicing SQL, designed for engineering students and beginners. It combines Duolingo-style interactive learning with a safe SQL execution playground.

### Core Value Proposition
- Learn SQL progressively through interactive lessons
- Practice with real queries in a safe sandbox
- Get immediate, beginner-friendly feedback
- Track progress with gamification elements
- Build skills from basics to intermediate concepts

---

## 2. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER                                   │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐         │
│  │   Mobile App    │  │   Admin Panel   │  │   Web Client    │         │
│  │  (React Native  │  │    (React)      │  │   (Optional)    │         │
│  │     + Expo)     │  │                 │  │                 │         │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘         │
└───────────┼─────────────────────┼─────────────────────┼─────────────────┘
            │                     │                     │
            └─────────────────────┼─────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           API GATEWAY                                    │
│                    (Rate Limiting, Auth, Routing)                        │
└─────────────────────────────────┬───────────────────────────────────────┘
                                  │
            ┌─────────────────────┼─────────────────────┐
            │                     │                     │
            ▼                     ▼                     ▼
┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐
│   Auth Service    │  │  Learning Service │  │  SQL Executor     │
│                   │  │                   │  │    Service        │
│  - JWT Tokens     │  │  - Courses        │  │                   │
│  - OAuth (Google) │  │  - Lessons        │  │  - Sandbox Mgmt   │
│  - Sessions       │  │  - Exercises      │  │  - Query Exec     │
│  - Permissions    │  │  - Progress       │  │  - Validation     │
└─────────┬─────────┘  └─────────┬─────────┘  └─────────┬─────────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           DATA LAYER                                     │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐         │
│  │  PostgreSQL     │  │     Redis       │  │ Object Storage  │         │
│  │  (Primary DB)   │  │    (Cache)      │  │   (Optional)    │         │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                       SQL SANDBOX LAYER                                  │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    Sandbox Pool Manager                          │   │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐    │   │
│  │  │ Sandbox 1 │  │ Sandbox 2 │  │ Sandbox 3 │  │ Sandbox N │    │   │
│  │  │ (Postgres)│  │ (Postgres)│  │ (Postgres)│  │ (Postgres)│    │   │
│  │  └───────────┘  └───────────┘  └───────────┘  └───────────┘    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Technology Stack

### Mobile Application
| Technology | Purpose | Rationale |
|------------|---------|-----------|
| React Native + Expo | Mobile framework | Cross-platform, rapid development, OTA updates |
| TypeScript | Language | Type safety, better DX |
| React Navigation | Navigation | Industry standard |
| TanStack Query | Data fetching | Caching, optimistic updates |
| Zustand | State management | Lightweight, simple |
| React Native Paper | UI components | Material Design, accessible |

### Backend API
| Technology | Purpose | Rationale |
|------------|---------|-----------|
| Node.js | Runtime | JavaScript ecosystem, performance |
| NestJS | Framework | Modular, TypeScript-first, enterprise patterns |
| PostgreSQL | Primary database | Relational, mature, SQL compliant |
| Prisma | ORM | Type-safe migrations, great DX |
| Redis | Cache/Sessions | Fast, pub/sub support |
| Passport.js | Authentication | Flexible strategies |

### SQL Execution Sandbox
| Technology | Purpose | Rationale |
|------------|---------|-----------|
| PostgreSQL | SQL engine | Standard SQL, reliable |
| Docker | Isolation | Container-based sandboxing |
| Node.js | Execution manager | Async I/O, streaming |

### Infrastructure
| Technology | Purpose | Rationale |
|------------|---------|-----------|
| Docker | Containerization | Consistent environments |
| Docker Compose | Local orchestration | Development simplicity |
| GitHub Actions | CI/CD | Integrated with repository |

---

## 4. Monorepo Structure

```
queryquest/
├── apps/
│   ├── mobile/                 # React Native + Expo mobile app
│   │   ├── src/
│   │   │   ├── components/     # Reusable UI components
│   │   │   ├── screens/        # Screen components
│   │   │   ├── navigation/     # Navigation configuration
│   │   │   ├── hooks/          # Custom React hooks
│   │   │   ├── stores/         # Zustand stores
│   │   │   ├── services/       # API client services
│   │   │   ├── utils/          # Utility functions
│   │   │   ├── theme/          # Theming and styling
│   │   │   └── types/          # TypeScript types
│   │   ├── app.json            # Expo configuration
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── api/                    # NestJS backend API
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/       # Authentication module
│   │   │   │   ├── users/      # User management
│   │   │   │   ├── courses/    # Courses and lessons
│   │   │   │   ├── exercises/  # Exercises and questions
│   │   │   │   ├── progress/   # Learning progress
│   │   │   │   ├── gamification/ # XP, streaks, badges
│   │   │   │   ├── sql/        # SQL execution
│   │   │   │   ├── datasets/   # Learning databases
│   │   │   │   └── analytics/  # Analytics tracking
│   │   │   ├── common/         # Shared utilities
│   │   │   ├── config/         # Configuration
│   │   │   ├── database/       # Database config
│   │   │   └── main.ts         # Entry point
│   │   ├── test/               # E2E and unit tests
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── admin/                  # Admin dashboard (Phase 2)
│       ├── src/
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   ├── ui/                     # Shared UI components (web)
│   ├── types/                  # Shared TypeScript types
│   ├── validation/             # Shared validation schemas
│   ├── config/                 # Shared configuration
│   └── eslint-config/          # Shared ESLint config
│
├── services/
│   └── sql-executor/           # SQL sandbox service
│       ├── src/
│       │   ├── sandbox/        # Sandbox management
│       │   ├── executor/       # Query execution
│       │   ├── validator/      # Query validation
│       │   └── datasets/       # Dataset loader
│       ├── package.json
│       └── tsconfig.json
│
├── database/
│   ├── migrations/             # Prisma migrations
│   ├── seeds/                  # Seed data scripts
│   └── datasets/               # Learning database schemas
│       ├── college-db/
│       ├── ecommerce-db/
│       └── library-db/
│
├── infrastructure/
│   ├── docker/                 # Docker configurations
│   │   ├── Dockerfile.api
│   │   ├── Dockerfile.executor
│   │   └── docker-compose.yml
│   └── deployment/             # Deployment configs
│
├── docs/                       # Documentation
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── DATABASE.md
│   └── CONTRIBUTING.md
│
├── .kiro/
│   └── steering/               # Kiro steering files
│
├── package.json                # Root package.json
├── docker-compose.yml          # Local development
├── .env.example
├── .gitignore
└── README.md
```

---

## 5. Core Modules

### 5.1 Authentication Module

**Responsibilities:**
- User registration (email/password)
- Google OAuth integration
- JWT token management
- Session handling
- Guest mode support
- Password reset

**Key Endpoints:**
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/google
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password
GET    /api/v1/auth/me
```

### 5.2 Users Module

**Responsibilities:**
- User profile management
- Preferences
- Statistics

**Key Endpoints:**
```
GET    /api/v1/users/profile
PATCH  /api/v1/users/profile
GET    /api/v1/users/stats
```

### 5.3 Courses Module

**Responsibilities:**
- Course structure management
- Lesson organization
- Topic hierarchy
- Prerequisites

**Key Endpoints:**
```
GET    /api/v1/courses
GET    /api/v1/courses/:id
GET    /api/v1/courses/:id/modules
GET    /api/v1/modules/:id/lessons
GET    /api/v1/lessons/:id
```

### 5.4 Exercises Module

**Responsibilities:**
- Exercise types management
- Question bank
- Answer validation
- Hint system

**Exercise Types:**
1. Multiple choice
2. Fill in the blank
3. Query prediction
4. Query writing
5. Debugging

**Key Endpoints:**
```
GET    /api/v1/exercises/:id
POST   /api/v1/exercises/:id/submit
POST   /api/v1/exercises/:id/hint
GET    /api/v1/exercises/:id/solution
```

### 5.5 Progress Module

**Responsibilities:**
- Lesson completion tracking
- Topic mastery
- Course progress
- Learning path state

**Key Endpoints:**
```
GET    /api/v1/progress
GET    /api/v1/progress/courses/:id
POST   /api/v1/progress/lessons/:id/complete
GET    /api/v1/progress/mastery
```

### 5.6 Gamification Module

**Responsibilities:**
- XP calculation
- Level progression
- Streak tracking
- Badge awards
- Leaderboards

**Key Endpoints:**
```
GET    /api/v1/gamification/profile
GET    /api/v1/gamification/badges
GET    /api/v1/gamification/leaderboard
POST   /api/v1/gamification/streak/update
```

### 5.7 SQL Execution Module

**Responsibilities:**
- Query validation
- Sandbox management
- Query execution
- Result formatting
- Error interpretation

**Key Endpoints:**
```
POST   /api/v1/sql/execute
GET    /api/v1/sql/databases
GET    /api/v1/sql/databases/:id/schema
GET    /api/v1/sql/databases/:id/tables/:table
GET    /api/v1/sql/history
POST   /api/v1/sql/saved
GET    /api/v1/sql/saved
DELETE /api/v1/sql/saved/:id
```

### 5.8 Datasets Module

**Responsibilities:**
- Learning database management
- Schema definitions
- Sample data
- Database reset

---

## 6. Data Models

### Core Entities

```
┌─────────────────┐     ┌─────────────────┐
│     User        │     │    Profile      │
├─────────────────┤     ├─────────────────┤
│ id (UUID)       │────▶│ user_id (FK)    │
│ email           │     │ display_name    │
│ password_hash   │     │ avatar_url      │
│ google_id       │     │ experience_level│
│ is_guest        │     │ timezone        │
│ created_at      │     │ preferences     │
│ updated_at      │     │ created_at      │
└─────────────────┘     └─────────────────┘
         │
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│  UserProgress   │     │    Streak       │
├─────────────────┤     ├─────────────────┤
│ user_id (FK)    │     │ user_id (FK)    │
│ total_xp        │     │ current_streak  │
│ current_level   │     │ longest_streak  │
│ topics_mastered │     │ last_activity   │
└─────────────────┘     └─────────────────┘

┌─────────────────┐     ┌─────────────────┐
│     Course      │     │     Module      │
├─────────────────┤     ├─────────────────┤
│ id (UUID)       │────▶│ course_id (FK)  │
│ title           │     │ title           │
│ description     │     │ description     │
│ difficulty      │     │ order_index     │
│ order_index     │     │ is_locked       │
│ is_published    │     └─────────────────┘
└─────────────────┘              │
                                 │
                                 ▼
┌─────────────────┐     ┌─────────────────┐
│     Lesson      │     │  LessonProgress │
├─────────────────┤     ├─────────────────┤
│ module_id (FK)  │────▶│ user_id (FK)    │
│ title           │     │ lesson_id (FK)  │
│ description     │     │ status          │
│ content (JSON)  │     │ xp_earned       │
│ order_index     │     │ completed_at    │
│ xp_reward       │     │ attempts        │
│ estimated_time  │     └─────────────────┘
└─────────────────┘

┌─────────────────┐     ┌─────────────────┐
│    Exercise     │     │ ExerciseAttempt │
├─────────────────┤     ├─────────────────┤
│ lesson_id (FK)  │────▶│ user_id (FK)    │
│ type            │     │ exercise_id(FK) │
│ title           │     │ answer          │
│ description     │     │ is_correct      │
│ content (JSON)  │     │ xp_earned       │
│ hints (JSON)    │     │ hints_used      │
│ solution        │     │ attempted_at    │
│ xp_reward       │     └─────────────────┘
│ difficulty      │
└─────────────────┘

┌─────────────────┐     ┌─────────────────┐
│    Badge        │     │ UserBadge       │
├─────────────────┤     ├─────────────────┤
│ id (UUID)       │────▶│ user_id (FK)    │
│ name            │     │ badge_id (FK)   │
│ description     │     │ earned_at       │
│ icon            │     │ metadata        │
│ category        │     └─────────────────┘
│ requirement     │
└─────────────────┘

┌─────────────────┐     ┌─────────────────┐
│    Dataset      │     │  DatasetTable   │
├─────────────────┤     ├─────────────────┤
│ id (UUID)       │────▶│ dataset_id (FK) │
│ name            │     │ name            │
│ description     │     │ schema (JSON)   │
│ is_active       │     │ row_count       │
└─────────────────┘     └─────────────────┘

┌─────────────────┐     ┌─────────────────┐
│   QueryHistory  │     │   SavedQuery    │
├─────────────────┤     ├─────────────────┤
│ user_id (FK)    │     │ user_id (FK)    │
│ query           │     │ title           │
│ dataset_id (FK) │     │ query           │
│ is_success      │     │ dataset_id (FK) │
│ error_message   │     │ created_at      │
│ execution_time  │     └─────────────────┘
│ executed_at     │
└─────────────────┘
```

---

## 7. SQL Sandbox Architecture

### Security Model

```
┌─────────────────────────────────────────────────────────────────────┐
│                        SQL EXECUTION FLOW                            │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│  1. REQUEST VALIDATION                                               │
│     - Authenticate user                                              │
│     - Check rate limits                                              │
│     - Validate request structure                                     │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│  2. QUERY VALIDATION                                                 │
│     - Parse SQL statement                                            │
│     - Check for forbidden operations                                 │
│     - Validate against allowed tables                                │
│     - Check query size limits                                        │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│  3. SANDBOX SELECTION                                                │
│     - Get or create isolated sandbox                                 │
│     - Reset to clean state if needed                                 │
│     - Apply dataset schema                                           │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│  4. QUERY EXECUTION                                                  │
│     - Execute with timeout                                           │
│     - Monitor resource usage                                         │
│     - Capture results/errors                                         │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│  5. RESULT PROCESSING                                                │
│     - Limit result rows                                              │
│     - Format output                                                  │
│     - Transform errors to friendly messages                          │
│     - Log execution metadata                                         │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│  6. RESPONSE                                                         │
│     - Return structured result                                       │
│     - Include execution metrics                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Sandbox Isolation Strategies

**MVP Approach: Schema Isolation**
- Single PostgreSQL instance
- Separate schema per dataset
- Row-level security
- Query timeouts

**Production Approach: Container Isolation**
- Docker containers per sandbox
- Resource limits (CPU, memory)
- Network isolation
- Automatic cleanup

### Query Execution Limits

| Limit | Value | Rationale |
|-------|-------|-----------|
| Query timeout | 5 seconds | Prevent long-running queries |
| Max rows returned | 500 | Prevent memory issues |
| Max query length | 10,000 chars | Prevent abuse |
| Rate limit | 60 queries/min | Prevent spam |
| Max concurrent queries | 5 | Resource management |

### Forbidden Operations

```sql
-- Blocked operations
DROP DATABASE
DROP SCHEMA
TRUNCATE (in read-only mode)
ALTER SYSTEM
COPY TO/FROM FILE
CREATE EXTENSION
-- And other administrative commands
```

---

## 8. Mobile Application Architecture

### Navigation Structure

```
Root Stack Navigator
├── Auth Stack (when not authenticated)
│   ├── Welcome Screen
│   ├── Login Screen
│   ├── Register Screen
│   └── Onboarding Flow
│
└── Main Tab Navigator (when authenticated)
    ├── Home Tab
    │   ├── Dashboard Screen
    │   └── Continue Learning
    │
    ├── Learn Tab
    │   ├── Course List Screen
    │   ├── Module List Screen
    │   ├── Lesson Screen
    │   └── Exercise Screen
    │
    ├── SQL Lab Tab
    │   ├── Playground Screen
    │   ├── Database Explorer Screen
    │   ├── Query History Screen
    │   └── Saved Queries Screen
    │
    ├── Challenges Tab
    │   ├── Daily Challenge Screen
    │   ├── Challenge List Screen
    │   └── Challenge Screen
    │
    └── Profile Tab
        ├── Profile Screen
        ├── Settings Screen
        ├── Achievements Screen
        └── Statistics Screen
```

### State Management

```typescript
// Store structure using Zustand
interface AppStore {
  // Auth state
  user: User | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  
  // Learning state
  currentCourse: Course | null;
  currentLesson: Lesson | null;
  lessonProgress: Map<string, LessonProgress>;
  
  // Gamification state
  xp: number;
  level: number;
  streak: number;
  badges: Badge[];
  
  // SQL Lab state
  currentDataset: Dataset | null;
  queryHistory: QueryHistoryItem[];
  savedQueries: SavedQuery[];
  
  // Actions
  login: (user: User) => void;
  logout: () => void;
  updateProgress: (progress: Progress) => void;
  // ... more actions
}
```

---

## 9. Error Handling Strategy

### Error Categories

```typescript
enum ErrorCode {
  // Authentication errors
  AUTH_INVALID_CREDENTIALS = 'AUTH_INVALID_CREDENTIALS',
  AUTH_TOKEN_EXPIRED = 'AUTH_TOKEN_EXPIRED',
  AUTH_UNAUTHORIZED = 'AUTH_UNAUTHORIZED',
  
  // Validation errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  
  // SQL errors
  SQL_SYNTAX_ERROR = 'SQL_SYNTAX_ERROR',
  SQL_TABLE_NOT_FOUND = 'SQL_TABLE_NOT_FOUND',
  SQL_COLUMN_NOT_FOUND = 'SQL_COLUMN_NOT_FOUND',
  SQL_CONSTRAINT_VIOLATION = 'SQL_CONSTRAINT_VIOLATION',
  SQL_TIMEOUT = 'SQL_TIMEOUT',
  SQL_FORBIDDEN = 'SQL_FORBIDDEN',
  
  // Rate limiting
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  
  // System errors
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
}
```

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "SQL_SYNTAX_ERROR",
    "message": "Your query contains a syntax error near 'FORM'",
    "hint": "Did you mean 'FROM' instead of 'FORM'?",
    "details": {
      "line": 1,
      "position": 14,
      "suggestion": "SELECT * FROM students;"
    }
  }
}
```

### SQL Error Interpretation

```typescript
const errorInterpretations: Record<string, ErrorInterpretation> = {
  'syntax error at or near': {
    category: 'SYNTAX',
    getMessage: (error) => `There's a syntax problem near "${error.position}"`,
    getHint: (error) => `Check your SQL keywords and punctuation around that area.`,
  },
  'relation ".*" does not exist': {
    category: 'TABLE_NOT_FOUND',
    getMessage: (error) => `The table "${error.tableName}" doesn't exist.`,
    getHint: (error) => `Check the table name spelling. Available tables: ${error.availableTables}`,
  },
  'column ".*" does not exist': {
    category: 'COLUMN_NOT_FOUND',
    getMessage: (error) => `Column "${error.columnName}" doesn't exist in this table.`,
    getHint: (error) => `Did you mean "${error.suggestion}"?`,
  },
};
```

---

## 10. Security Considerations

### Authentication & Authorization

- JWT tokens with short expiry (15 minutes)
- Refresh tokens with longer expiry (7 days)
- Token rotation on refresh
- Secure HTTP-only cookies for web
- Secure storage on mobile (Expo SecureStore)

### SQL Injection Prevention

- Parameterized queries ONLY
- Query parsing before execution
- Whitelist allowed tables/columns
- Input sanitization
- Read-only transactions where appropriate

### API Security

- Rate limiting per user/IP
- Request validation with Zod
- CORS configuration
- Helmet.js security headers
- Input size limits

### Data Protection

- Password hashing (bcrypt)
- No sensitive data in logs
- Encrypted connections (TLS)
- Secrets management via environment variables
- Database encryption at rest (production)

---

## 11. Performance Optimization

### Mobile App

- Lazy loading of lessons
- Paginated lists
- Image optimization
- Offline caching for lessons
- Optimistic UI updates
- Debounced search

### Backend

- Database connection pooling
- Redis caching for:
  - Course content
  - User progress
  - Leaderboards
- Query optimization
- Pagination
- Compression

### SQL Execution

- Connection pooling for sandbox databases
- Prepared statements
- Result streaming for large datasets
- Timeout enforcement

---

## 12. Observability

### Logging

```typescript
interface LogEntry {
  timestamp: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  service: string;
  traceId: string;
  userId?: string;
  message: string;
  metadata?: Record<string, unknown>;
}
```

### Metrics

- Request latency (p50, p95, p99)
- Error rates
- SQL execution latency
- Active users
- Lesson completion rate
- Query success rate

### Health Checks

```
GET /health        → Basic health check
GET /health/ready  → Readiness (DB, Redis, Sandbox)
GET /health/live   → Liveness
```

---

## 13. Deployment Architecture

### Development

```
docker-compose up
├── api (port 3000)
├── sql-executor (port 3001)
├── postgres (port 5432)
├── redis (port 6379)
└── sandbox-postgres (port 5433)
```

### Production (Future)

```
┌─────────────────────────────────────────────────────────────┐
│                      Load Balancer                           │
└─────────────────────────────────────────────────────────────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
           ▼               ▼               ▼
    ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
    │   API Pod   │ │   API Pod   │ │   API Pod   │
    └──────┬──────┘ └──────┬──────┘ └──────┬──────┘
           │               │               │
           └───────────────┼───────────────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
           ▼               ▼               ▼
    ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
    │  Executor   │ │  Executor   │ │  Executor   │
    │    Pod      │ │    Pod      │ │    Pod      │
    └──────┬──────┘ └──────┬──────┘ └──────┬──────┘
           │               │               │
           └───────────────┼───────────────┘
                           │
                           ▼
              ┌─────────────────────────┐
              │   Managed PostgreSQL     │
              │   + Redis                │
              └─────────────────────────┘
```

---

## 14. Future Considerations

### Phase 2
- Multiple SQL engines (MySQL, SQLite)
- AI SQL tutor
- Advanced challenges
- Team/classroom features

### Phase 3
- Certificates
- Interview preparation mode
- Custom datasets
- Institution dashboards

---

## 15. Development Guidelines

### Code Style
- TypeScript strict mode
- ESLint + Prettier
- Conventional commits
- PR-based workflow

### Testing Strategy
- Unit tests for business logic
- Integration tests for API
- E2E tests for critical paths
- Minimum 80% coverage

### Documentation
- API documentation (OpenAPI/Swagger)
- Code comments for complex logic
- README for each package
- Architecture decision records (ADRs)
---

<p align="center">
  <strong>Built by <a href="https://www.linkedin.com/in/sagar-sahoo-777918339/">Sagar Sahoo</a></strong>
</p>
<p align="center">
  <a href="mailto:sagarsahoo419@gmail.com">sagarsahoo419@gmail.com</a>
</p>
