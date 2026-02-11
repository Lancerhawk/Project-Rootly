# Rootly

**Surface Production Errors Directly in Your IDE**

Rootly is a developer platform designed to bridge the gap between production failures and your development environment. Get real-time notifications about production errors right where you code, with full context and stack traces.

## Overview

Rootly transforms how developers handle production errors by bringing them directly into the IDE. Instead of switching between monitoring dashboards and code editors, developers receive inline notifications about production failures with complete context, making debugging faster and more efficient.

### The Problem

- **Context Switching**: Developers waste time switching between error monitoring tools and their IDE
- **Delayed Awareness**: Production errors often go unnoticed until users complain
- **Missing Context**: Error logs lack the full context needed for quick debugging
- **Slow Resolution**: Finding and fixing production bugs takes too long

### The Solution

Rootly provides:
- **IDE Integration**: Errors appear directly in your code editor
- **Real-time Notifications**: Instant alerts when production errors occur
- **Full Context**: Complete stack traces, user data, and environment info
- **Quick Resolution**: Jump directly to the problematic code with one click

## Key Features

### Current (v1.2.2 - SDK and IDE Extension Fixes)

- SDK v1.2.6 - Fixed Express middleware to properly detect 5xx errors
- SDK v1.2.5 - Added commit SHA fallback for local development
- IDE Extension v1.1.2 - Fixed file path resolution for Windows absolute paths
- IDE Extension v1.1.1 - Stack trace parsing handles paths with spaces
- Production Stability - All critical error capture bugs resolved

### Previously Implemented (v1.2.0 - Runtime SDK Production Hardening)

- Production-Ready SDK - rootly-runtime v1.2.0 with 283 lines of hardened code
- Severity Support - Capture errors with error, warning, info levels
- Environment Normalization - Automatic production/preview normalization with NODE_ENV fallback
- Debug Mode - Optional stderr logging for SDK visibility
- Recursive Protection - Symbol flag prevents infinite loops
- Stable Fingerprinting - Improved deduplication with normalized whitespace
- Hard Memory Cap - Max 500 fingerprints with auto-cleanup
- Optimized Rate Limiter - O(n) performance
- Clean Public API - Removed apiUrl from InitOptions (use ROOTLY_API_URL env var)
- Critical Bug Fixes - Environment fallback, listener guards, transport counter

### Previously Implemented (v1.1.0 - IDE Extension Release)

- Go to Error Location - One-click navigation to exact file and line where errors occurred
- Expandable Incident Cards - Click incidents to see environment, timestamps, and commit SHA
- New Incident Notifications - Desktop alerts when new incidents are detected
- Manual Refresh - Rate-limited refresh button (5 per 2 minutes)
- Professional UI Redesign - Clean, minimal interface with VS Code native icons
- Enhanced OAuth Flow - Minimal, professional IDE authentication page

### Previously Implemented (v1.0.3)

- Cross-Site Cookie Support - SameSite=None for cross-domain auth
- Session Race Condition Fix - Explicit session saving before redirect
- Route Architecture Cleanup - Separated OAuth and API routes
- Security Hardening - Removed token exposure from API responses
- Proxy Trust Configuration - Support for reverse proxy deployments

### Previously Implemented (v1.0.2)

- Hardened Ingest Endpoint - POST /api/ingest with strict validation
- Commit SHA Validation - Enforces 40-char lowercase hex Git SHAs
- Enhanced Data Capture - Stack traces, error types, environment, timestamps
- Incidents Read API - GET /api/incidents with JWT auth and filtering
- Comprehensive Documentation - Testing guides and migration docs

### Previously Implemented (v1.0.1)

- GitHub OAuth Authentication - Secure login with GitHub
- Project Management - Create and manage multiple projects
- API Key Generation - Secure keys for SDK integration
- User Dashboard - Overview of all your projects
- Premium UI - Modern, responsive dark-themed interface

### Coming Soon

- **Node.js SDK** (v0.2.0) - Error tracking library for Node.js apps
- **Error Dashboard** (v0.4.0) - Real-time monitoring and analytics
- **Team Collaboration** - Share and assign errors to team members
- **Source Maps** - Accurate stack traces for production code

## Architecture

### High-Level Architecture

```mermaid
graph TB
    subgraph "Developer's Machine"
        IDE[VS Code Extension]
        Browser[Web Dashboard]
    end
    
    subgraph "User's Application"
        App[Node.js Application]
        SDK[Rootly SDK]
    end
    
    subgraph "Rootly Platform"
        API[Backend API]
        DB[(PostgreSQL)]
    end
    
    subgraph "Authentication"
        GitHub[GitHub OAuth]
    end
    
    App -->|Captures Errors| SDK
    SDK -->|Sends Error Data| API
    API -->|Stores| DB
    IDE -->|Polls Every 45s| API
    API -->|Returns Incidents| IDE
    Browser -->|Manages Projects| API
    API -->|Authenticates| GitHub
    GitHub -->|User Info| API
    
    style IDE fill:#4F46E5
    style SDK fill:#10B981
    style API fill:#F59E0B
    style DB fill:#EF4444
```

### System Components

```mermaid
graph LR
    subgraph "Frontend (Next.js 15)"
        Landing[Landing Page]
        Dashboard[Dashboard]
        Projects[Project Management]
        Auth[Auth Flow]
        Docs[Documentation]
    end
    
    subgraph "Backend (Node.js + Express)"
        AuthAPI[Auth Routes]
        ProjectAPI[Project Routes]
        IngestAPI[Ingest Routes]
        IncidentsAPI[Incidents Routes]
        Middleware[Auth Middleware]
    end
    
    subgraph "Database (Supabase)"
        Users[(Users)]
        ProjectsDB[(Projects)]
        APIKeys[(API Keys)]
        Incidents[(Incidents)]
    end
    
    Landing --> Auth
    Auth --> AuthAPI
    Dashboard --> ProjectAPI
    Projects --> ProjectAPI
    
    AuthAPI --> Users
    ProjectAPI --> ProjectsDB
    ProjectAPI --> APIKeys
    IngestAPI --> Incidents
    IncidentsAPI --> Incidents
    
    AuthAPI --> Middleware
    ProjectAPI --> Middleware
    IncidentsAPI --> Middleware
    
    style Landing fill:#4F46E5
    style Backend fill:#10B981
    style Database fill:#EF4444
```

## Workflow

### User Onboarding & Project Setup

```mermaid
sequenceDiagram
    actor Dev as Developer
    participant Web as Rootly Web App
    participant GitHub as GitHub OAuth
    participant API as Backend API
    participant DB as Database
    
    Dev->>Web: Visit rootly.dev
    Dev->>Web: Click "Get Started"
    Web->>GitHub: Redirect to OAuth
    GitHub->>Dev: Request permissions
    Dev->>GitHub: Authorize
    GitHub->>API: Send auth code
    API->>GitHub: Exchange for token
    GitHub->>API: Return user data
    API->>DB: Create/Update user
    API->>Web: Session created
    Web->>Dev: Redirect to Dashboard
    
    Dev->>Web: Create New Project
    Web->>API: POST /api/projects
    API->>DB: Store project
    API->>DB: Generate API key
    DB->>API: Return project + key
    API->>Web: Project created
    Web->>Dev: Show API key (once)
```

### Error Tracking Flow

```mermaid
sequenceDiagram
    actor User as End User
    participant App as Node.js App
    participant SDK as Rootly SDK
    participant API as Rootly API
    participant DB as Database
    participant IDE as VS Code Extension
    actor Dev as Developer
    
    User->>App: Triggers error
    App->>SDK: Error caught
    SDK->>SDK: Capture stack trace
    SDK->>SDK: Collect context
    SDK->>API: POST /api/ingest
    API->>DB: Store incident
    API-->>SDK: 201 Created
    
    Note over IDE: Polls every 45 seconds
    IDE->>API: GET /api/incidents
    API->>DB: Query incidents
    DB-->>API: Return incidents
    API-->>IDE: Incident list
    IDE->>Dev: Show notification
    Dev->>IDE: Click incident
    IDE->>IDE: Parse stack trace
    IDE->>Dev: Jump to code location
    Dev->>App: Fix the bug
```

## Technology Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with modern design
- **Authentication**: Passport.js with GitHub OAuth

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Prisma 6
- **Authentication**: Passport.js
- **Session Store**: PostgreSQL

### Database
- **Primary DB**: Supabase (PostgreSQL)
- **Schema Management**: Prisma Migrate

### DevOps
- **Version Control**: Git + GitHub
- **Package Manager**: npm
- **Development**: tsx (TypeScript execution)

## Project Structure

```
Project-Rootly/
├── runtime-sdk/              # Node.js SDK for error capture
│   ├── src/
│   │   ├── index.ts         # Main SDK exports
│   │   ├── runtime.ts       # Core error capture logic
│   │   ├── context.ts       # Environment context detection
│   │   └── transport.ts     # HTTP transport layer
│   ├── dist/                # Compiled JavaScript
│   ├── package.json         # Published as rootly-runtime
│   ├── CHANGELOG.md
│   └── README.md
│
├── ide-extension/           # VS Code extension
│   ├── src/
│   │   ├── extension.ts     # Extension entry point
│   │   ├── auth.ts          # GitHub OAuth flow
│   │   ├── api.ts           # Backend API client
│   │   ├── poller.ts        # 45-second incident polling
│   │   ├── state.ts         # Extension state management
│   │   ├── repoDetection.ts # Git repository detection
│   │   └── views/
│   │       └── incidentsTree.ts  # Sidebar tree view
│   ├── resources/           # Extension icons
│   ├── out/                 # Compiled JavaScript
│   ├── package.json         # VS Code extension manifest
│   ├── CHANGELOG.md
│   └── README.md
│
├── webapp/
│   ├── frontend/            # Next.js 15 application
│   │   ├── app/
│   │   │   ├── components/  # React components
│   │   │   ├── dashboard/   # Dashboard page
│   │   │   ├── projects/    # Project management
│   │   │   ├── docs/        # Documentation page
│   │   │   ├── layout.tsx   # Root layout
│   │   │   └── page.tsx     # Landing page
│   │   ├── public/
│   │   │   └── versions.json  # Version history
│   │   └── package.json
│   │
│   ├── backend/             # Express.js API
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   │   ├── auth.ts      # User authentication
│   │   │   │   ├── oauth.ts     # GitHub OAuth callback
│   │   │   │   ├── projects.ts  # Project management
│   │   │   │   ├── ingest.ts    # Error ingestion endpoint
│   │   │   │   └── incidents.ts # Incidents read API
│   │   │   ├── services/
│   │   │   │   └── keys.ts      # API key generation
│   │   │   └── index.ts         # Server entry point
│   │   ├── prisma/
│   │   │   ├── schema.prisma    # Database schema
│   │   │   └── migrations/      # Database migrations
│   │   └── package.json
│   ├── CHANGELOG.md
│   └── README.md
│
├── test/
│   └── production-test/     # Comprehensive SDK test suite
│       ├── index.js         # Express app with all error scenarios
│       ├── test-errors.ps1  # PowerShell test script
│       ├── test-errors.sh   # Bash test script
│       ├── package.json
│       └── README.md        # Test documentation
│
├── docs/                    # Technical documentation
│   ├── architecture.md      # System architecture
│   ├── backend-api.md       # API documentation
│   ├── database-schema.md   # Database design
│   ├── edge-cases.md        # Edge case handling
│   ├── ide-extension-design.md  # Extension architecture
│   ├── incidents-api-testing.md # API testing guide
│   └── sdk-design.md        # SDK architecture
│
├── CHANGELOG.md             # Project-wide changelog
├── LICENSE
└── README.md                # This file
```

## Getting Started

### Prerequisites

- **Node.js**: v18 or higher
- **npm**: v9 or higher
- **PostgreSQL**: v14 or higher (or Supabase account)
- **GitHub Account**: For OAuth authentication

### 1. Clone the Repository

```bash
git clone https://github.com/Lancerhawk/Project-Rootly.git
cd Project-Rootly
```

### 2. Set Up the Database

#### Option A: Using Supabase (Recommended)

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Copy the connection string from Settings → Database
4. Note down the direct connection URL (not the pooler URL)

#### Option B: Local PostgreSQL

1. Install PostgreSQL on your machine
2. Create a new database:
   ```bash
   createdb rootly_dev
   ```

### 3. Configure Environment Variables

#### Backend Configuration

Create `webapp/backend/.env`:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database"

# Session Secret (generate a random string)
SESSION_SECRET="your-super-secret-session-key-change-this"

# GitHub OAuth (create at https://github.com/settings/developers)
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
GITHUB_CALLBACK_URL="http://localhost:3001/api/auth/github/callback"

# Server
PORT=3001
NODE_ENV=development

# Frontend URL
FRONTEND_URL="http://localhost:3000"
```

#### Frontend Configuration

Create `webapp/frontend/.env.local`:

```env
# Backend API URL
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

### 4. Set Up GitHub OAuth Application

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the details:
   - **Application name**: Rootly Local Dev
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3001/api/auth/github/callback`
4. Click "Register application"
5. Copy the **Client ID** and **Client Secret** to your backend `.env` file

### 5. Install Dependencies

```bash
# Install backend dependencies
cd webapp/backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 6. Set Up the Database Schema

```bash
# Navigate to backend directory
cd webapp/backend

# Run Prisma migrations
npx prisma migrate dev

# (Optional) Open Prisma Studio to view your database
npx prisma studio
```

### 7. Start the Development Servers

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd webapp/backend
npm run dev
```

The backend will start on `http://localhost:3001`

**Terminal 2 - Frontend:**
```bash
cd webapp/frontend
npm run dev
```

The frontend will start on `http://localhost:3000`

### 8. Access the Application

1. Open your browser and navigate to `http://localhost:3000`
2. Click "Get Started" to authenticate with GitHub
3. Create your first project
4. Copy the API key (it's shown only once!)

## Roadmap

### Phase 1: Web App Foundation (v1.0.0) - Completed
- GitHub OAuth authentication
- Project management
- API key generation
- User dashboard
- Premium UI design

### Phase 2: Production-Ready Error Ingestion (v1.0.2) - Completed
- Hardened ingest endpoint (POST /api/ingest)
- Strict validation (commit SHA, environment, timestamps)
- Enhanced data capture (stack traces, error types)
- Incidents read API (GET /api/incidents)
- Comprehensive documentation

### Phase 3: Node.js SDK (v0.2.0) - In Progress
- Error capture and serialization
- Stack trace parsing
- Source map support
- Context collection
- API integration

### Phase 4: VS Code Extension (v1.1.0) - Completed
- Real-time error notifications
- Expandable incident cards
- Jump to error location with stack trace parsing
- GitHub repository sync
- Professional UI with native icons
- Manual refresh with rate limiting

### Phase 5: Error Dashboard (v0.4.0) - Planned
- Error analytics and charts
- Error grouping and deduplication
- Source code viewer
- Team collaboration features
- Error assignment and tracking

## Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Keep PRs focused and small

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

- **GitHub**: [@Lancerhawk](https://github.com/Lancerhawk)
- **Project Repository**: [Project-Rootly](https://github.com/Lancerhawk/Project-Rootly)

## Acknowledgments

Built with modern web technologies and a passion for improving developer experience.

**Current Version**: 1.1.0 - IDE Extension Release

---

<div align="center">
  <strong>Made by developer, for developers</strong>
</div>