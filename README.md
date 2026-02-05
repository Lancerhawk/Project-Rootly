# 🚀 Rootly

**Surface Production Errors Directly in Your IDE**

Rootly is a developer platform designed to bridge the gap between production failures and your development environment. Get real-time notifications about production errors right where you code, with full context and stack traces.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Workflow](#workflow)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Roadmap](#roadmap)
- [Contributing](#contributing)

---

## 🎯 Overview

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

---

## ✨ Key Features

### Current (v0.0.1 - Web App Foundation)

- ✅ **GitHub OAuth Authentication** - Secure login with GitHub
- ✅ **Project Management** - Create and manage multiple projects
- ✅ **API Key Generation** - Secure keys for SDK integration
- ✅ **User Dashboard** - Overview of all your projects
- ✅ **Premium UI** - Modern, responsive dark-themed interface

### Coming Soon

- 🔄 **Node.js SDK** - Error tracking library for Node.js apps
- 🔄 **VS Code Extension** - Inline error notifications in your editor
- 🔄 **Error Dashboard** - Real-time monitoring and analytics
- 🔄 **Team Collaboration** - Share and assign errors to team members
- 🔄 **Source Maps** - Accurate stack traces for production code

---

## 🏗️ Architecture

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
        WS[WebSocket Server]
    end
    
    subgraph "Authentication"
        GitHub[GitHub OAuth]
    end
    
    App -->|Captures Errors| SDK
    SDK -->|Sends Error Data| API
    API -->|Stores| DB
    API -->|Real-time Updates| WS
    WS -->|Notifications| IDE
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
    end
    
    subgraph "Backend (Node.js + Express)"
        AuthAPI[Auth Routes]
        ProjectAPI[Project Routes]
        ErrorAPI[Error Routes - Planned]
        Middleware[Auth Middleware]
    end
    
    subgraph "Database (Supabase)"
        Users[(Users)]
        ProjectsDB[(Projects)]
        APIKeys[(API Keys)]
        Errors[(Errors - Planned)]
    end
    
    Landing --> Auth
    Auth --> AuthAPI
    Dashboard --> ProjectAPI
    Projects --> ProjectAPI
    
    AuthAPI --> Users
    ProjectAPI --> ProjectsDB
    ProjectAPI --> APIKeys
    ErrorAPI -.-> Errors
    
    AuthAPI --> Middleware
    ProjectAPI --> Middleware
    
    style Landing fill:#4F46E5
    style Backend fill:#10B981
    style Database fill:#EF4444
```

---

## 🔄 Workflow

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

### Error Tracking Flow (Planned)

```mermaid
sequenceDiagram
    actor User as End User
    participant App as Node.js App
    participant SDK as Rootly SDK
    participant API as Rootly API
    participant DB as Database
    participant WS as WebSocket
    participant IDE as VS Code Extension
    actor Dev as Developer
    
    User->>App: Triggers error
    App->>SDK: Error caught
    SDK->>SDK: Capture stack trace
    SDK->>SDK: Collect context
    SDK->>API: POST /api/errors
    API->>DB: Store error
    API->>WS: Broadcast error event
    WS->>IDE: Push notification
    IDE->>Dev: Show inline error
    Dev->>IDE: Click error
    IDE->>Dev: Jump to code location
    Dev->>App: Fix the bug
```

---

## 🛠️ Technology Stack

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

---

## 📁 Project Structure

```
Project-Rootly/
├── webapp/
│   ├── frontend/              # Next.js 15 application
│   │   ├── app/
│   │   │   ├── components/    # React components
│   │   │   ├── dashboard/     # Dashboard page
│   │   │   ├── projects/      # Project management
│   │   │   ├── layout.tsx     # Root layout
│   │   │   └── page.tsx       # Landing page
│   │   ├── public/
│   │   │   └── versions.json  # Version history
│   │   └── package.json
│   │
│   └── backend/               # Express.js API
│       ├── src/
│       │   ├── routes/        # API routes
│       │   │   ├── auth.ts    # Authentication
│       │   │   └── projects.ts # Project management
│       │   ├── services/      # Business logic
│       │   │   └── keys.ts    # API key generation
│       │   └── index.ts       # Server entry point
│       ├── prisma/
│       │   └── schema.prisma  # Database schema
│       └── package.json
│
├── docs/                      # Documentation
│   ├── backend-api.md
│   ├── database-schema.md
│   └── edge-cases.md
│
└── README.md                  # This file
```

---

## 🚀 Getting Started

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

---

## 🗺️ Roadmap

### Phase 1: Web App Foundation ✅ (Current - v0.0.1)
- [x] GitHub OAuth authentication
- [x] Project management
- [x] API key generation
- [x] User dashboard
- [x] Premium UI design

### Phase 2: Node.js SDK 🔄 (v0.1.0)
- [ ] Error capture and serialization
- [ ] Stack trace parsing
- [ ] Source map support
- [ ] Context collection
- [ ] API integration

### Phase 3: VS Code Extension 🔄 (v0.2.0)
- [ ] Real-time error notifications
- [ ] Inline error display
- [ ] Jump to error location
- [ ] GitHub repository sync
- [ ] Error filtering

### Phase 4: Error Dashboard 🔄 (v0.3.0)
- [ ] Error analytics and charts
- [ ] Error grouping and deduplication
- [ ] Source code viewer
- [ ] Team collaboration features
- [ ] Error assignment and tracking

---

## 🤝 Contributing

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

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📧 Contact

- **GitHub**: [@Lancerhawk](https://github.com/Lancerhawk)
- **Project Repository**: [Project-Rootly](https://github.com/Lancerhawk/Project-Rootly)

---

## 🙏 Acknowledgments

Built with modern web technologies and a passion for improving developer experience.

**Current Version**: 0.0.1 - Web App Foundation

---

<div align="center">
  <strong>Made with ⚡ by developers, for developers</strong>
</div>
