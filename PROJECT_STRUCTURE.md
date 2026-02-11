# Project Structure

This document provides a comprehensive overview of the Project Rootly codebase organization, file structure, and architectural patterns.

## Repository Overview

Project Rootly is a monorepo containing three main components:

1. **webapp**: Web application (Next.js frontend + Express backend)
2. **runtime-sdk**: Node.js SDK for error capture
3. **ide-extension**: VS Code extension for IDE integration

## Directory Structure

```
Project-Rootly/
├── .git/                           # Git repository metadata
├── .github/                        # GitHub-specific files
│   ├── ISSUE_TEMPLATE/            # Issue templates
│   ├── workflows/                 # CI/CD workflows
│   └── pull_request_template.md  # PR template
│
├── docs/                          # Technical documentation
│   ├── architecture.md           # System architecture
│   ├── backend-api.md            # API documentation
│   ├── database-schema.md        # Database design
│   ├── edge-cases.md             # Edge case handling
│   ├── ide-extension-design.md   # Extension architecture
│   ├── incidents-api-testing.md  # API testing guide
│   └── sdk-design.md             # SDK architecture
│
├── runtime-sdk/                   # Node.js SDK package
│   ├── src/                      # TypeScript source files
│   │   ├── index.ts             # Main exports and initialization
│   │   ├── runtime.ts           # Core error capture logic
│   │   ├── context.ts           # Environment context detection
│   │   └── transport.ts         # HTTP transport layer
│   ├── dist/                     # Compiled JavaScript output
│   ├── package.json              # SDK package configuration
│   ├── tsconfig.json             # TypeScript configuration
│   ├── README.md                 # SDK documentation
│   └── CHANGELOG.md              # SDK version history
│
├── ide-extension/                 # VS Code extension
│   ├── src/                      # TypeScript source files
│   │   ├── extension.ts         # Extension entry point
│   │   ├── auth.ts              # GitHub OAuth flow
│   │   ├── api.ts               # Backend API client
│   │   ├── poller.ts            # Incident polling service
│   │   ├── state.ts             # Extension state management
│   │   ├── repoDetection.ts     # Git repository detection
│   │   └── views/               # UI components
│   │       └── incidentsTree.ts # Sidebar tree view
│   ├── resources/                # Extension assets
│   │   ├── icon.png             # Extension icon
│   │   └── icon.svg             # Activity bar icon
│   ├── out/                      # Compiled JavaScript output
│   ├── package.json              # Extension manifest
│   ├── tsconfig.json             # TypeScript configuration
│   ├── README.md                 # Extension documentation
│   └── CHANGELOG.md              # Extension version history
│
├── webapp/                        # Web application
│   ├── frontend/                 # Next.js application
│   │   ├── app/                 # Next.js App Router
│   │   │   ├── components/      # React components
│   │   │   │   ├── Navbar.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── ParticleBackground.tsx
│   │   │   │   └── VersionModal.tsx
│   │   │   ├── dashboard/       # Dashboard page
│   │   │   │   └── page.tsx
│   │   │   ├── projects/        # Project management
│   │   │   │   └── page.tsx
│   │   │   ├── docs/            # Documentation page
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx       # Root layout
│   │   │   ├── page.tsx         # Landing page
│   │   │   └── globals.css      # Global styles
│   │   ├── public/              # Static assets
│   │   │   ├── versions.json    # Version history data
│   │   │   └── images/          # Image assets
│   │   ├── package.json         # Frontend dependencies
│   │   ├── tsconfig.json        # TypeScript configuration
│   │   ├── tailwind.config.ts   # Tailwind CSS configuration
│   │   ├── postcss.config.mjs   # PostCSS configuration
│   │   └── next.config.ts       # Next.js configuration
│   │
│   ├── backend/                  # Express.js API
│   │   ├── src/                 # TypeScript source files
│   │   │   ├── index.ts        # Server entry point
│   │   │   ├── routes/         # API route handlers
│   │   │   │   ├── auth.ts     # User authentication
│   │   │   │   ├── oauth.ts    # GitHub OAuth callback
│   │   │   │   ├── github.ts   # GitHub API integration
│   │   │   │   ├── projects.ts # Project management
│   │   │   │   ├── ingest.ts   # Error ingestion endpoint
│   │   │   │   ├── incidents.ts # Incidents read API
│   │   │   │   └── test.ts     # Test endpoints
│   │   │   ├── services/       # Business logic
│   │   │   │   └── keys.ts     # API key generation
│   │   │   └── middleware/     # Express middleware
│   │   │       └── errorHandler.ts
│   │   ├── prisma/              # Database schema and migrations
│   │   │   ├── schema.prisma   # Prisma schema definition
│   │   │   └── migrations/     # Database migration files
│   │   ├── scripts/             # Utility scripts
│   │   │   └── setup-db.ts     # Database setup script
│   │   ├── dist/                # Compiled JavaScript output
│   │   ├── package.json         # Backend dependencies
│   │   └── tsconfig.json        # TypeScript configuration
│   │
│   ├── README.md                 # Webapp documentation
│   └── CHANGELOG.md              # Webapp version history
│
├── test/                          # Test suites
│   └── production-test/          # SDK integration tests
│       ├── index.js             # Express test application
│       ├── test-errors.ps1      # PowerShell test script
│       ├── test-errors.sh       # Bash test script
│       ├── package.json         # Test dependencies
│       └── README.md            # Test documentation
│
├── CHANGELOG.md                   # Project-wide changelog
├── CONTRIBUTING.md                # Contribution guidelines
├── CODE_OF_CONDUCT.md            # Community standards
├── COMMIT_CONVENTION.md          # Commit message format
├── BRANCHING_STRATEGY.md         # Git workflow
├── PROJECT_STRUCTURE.md          # This file
├── LICENSE                        # MIT License
└── README.md                      # Project overview
```

## Component Details

### Runtime SDK (`runtime-sdk/`)

The runtime SDK is a standalone npm package that captures production errors and sends them to the Rootly backend.

**Key Files**:
- `src/index.ts`: Public API exports, initialization function
- `src/runtime.ts`: Error capture, fingerprinting, rate limiting
- `src/context.ts`: Environment detection, metadata collection
- `src/transport.ts`: HTTP client, graceful shutdown handling

**Build Output**: `dist/` contains compiled JavaScript and TypeScript declarations

**Package Name**: `rootly-runtime` (published to npm)

### IDE Extension (`ide-extension/`)

The VS Code extension provides real-time production error notifications directly in the IDE.

**Key Files**:
- `src/extension.ts`: Extension lifecycle, command registration, activation
- `src/auth.ts`: GitHub OAuth flow, token management
- `src/api.ts`: Backend API client for fetching incidents
- `src/poller.ts`: 45-second polling service for new incidents
- `src/state.ts`: Extension state persistence
- `src/repoDetection.ts`: Git repository detection and validation
- `src/views/incidentsTree.ts`: Sidebar tree view, incident rendering, navigation

**Build Output**: `out/` contains compiled JavaScript

**Extension ID**: `ArinJain.rootly`

### Web Application (`webapp/`)

The web application consists of a Next.js frontend and Express.js backend.

#### Frontend (`webapp/frontend/`)

**Technology Stack**:
- Next.js 15 with App Router
- React 19
- TypeScript
- Tailwind CSS

**Key Directories**:
- `app/components/`: Reusable React components
- `app/dashboard/`: User dashboard with project overview
- `app/projects/`: Project management interface
- `app/docs/`: Documentation page
- `public/`: Static assets and version data

**Routing**: File-based routing using Next.js App Router

#### Backend (`webapp/backend/`)

**Technology Stack**:
- Node.js with Express.js
- TypeScript
- Prisma 6 ORM
- Passport.js for authentication
- PostgreSQL via Supabase

**Key Directories**:
- `src/routes/`: API endpoint handlers
- `src/services/`: Business logic and utilities
- `src/middleware/`: Express middleware functions
- `prisma/`: Database schema and migrations

**API Endpoints**:
- `/auth/*`: GitHub OAuth flow
- `/api/me`: User profile
- `/api/projects`: Project management
- `/api/ingest`: Error ingestion (SDK)
- `/api/incidents`: Incidents retrieval (extension)

## File Naming Conventions

### TypeScript Files

- **Components**: PascalCase (e.g., `Navbar.tsx`, `ParticleBackground.tsx`)
- **Routes/Pages**: lowercase (e.g., `page.tsx`, `layout.tsx`)
- **Services**: camelCase (e.g., `keys.ts`, `errorHandler.ts`)
- **API Routes**: lowercase (e.g., `auth.ts`, `projects.ts`)

### Configuration Files

- **TypeScript**: `tsconfig.json`
- **Package**: `package.json`
- **Tailwind**: `tailwind.config.ts`
- **Next.js**: `next.config.ts`
- **Prisma**: `schema.prisma`

### Documentation Files

- **Markdown**: UPPERCASE for root-level (e.g., `README.md`, `CHANGELOG.md`)
- **Markdown**: lowercase for subdirectories (e.g., `docs/architecture.md`)

## Module Organization

### Import Order

Organize imports in the following order:

1. External dependencies (e.g., `react`, `express`)
2. Internal absolute imports (e.g., `@/components`)
3. Relative imports (e.g., `./utils`)

Example:
```typescript
import { useState } from 'react';
import express from 'express';

import Navbar from '@/components/Navbar';

import { generateKey } from './services/keys';
```

### Export Patterns

- **Named exports**: Preferred for utilities and services
- **Default exports**: Used for React components and pages

## Configuration Files

### TypeScript Configuration

Each component has its own `tsconfig.json`:

- **webapp/frontend**: Configured for Next.js with JSX support
- **webapp/backend**: Configured for Node.js with CommonJS output
- **runtime-sdk**: Configured for library distribution with declarations
- **ide-extension**: Configured for VS Code extension development

### Build Output Directories

- **Frontend**: `.next/` (Next.js build output, gitignored)
- **Backend**: `dist/` (compiled JavaScript, gitignored)
- **SDK**: `dist/` (published to npm, gitignored locally)
- **Extension**: `out/` (compiled JavaScript, gitignored)

## Database Schema Location

The database schema is defined in `webapp/backend/prisma/schema.prisma`.

**Key Models**:
- `User`: GitHub authenticated users
- `Project`: User projects linked to repositories
- `ApiKey`: API keys for SDK authentication
- `Incident`: Production error incidents
- `Session`: User session storage

**Migrations**: Located in `webapp/backend/prisma/migrations/`

## Environment Variables

Environment variables are stored in `.env` files (gitignored):

- `webapp/backend/.env`: Backend configuration
- `webapp/frontend/.env.local`: Frontend configuration
- `runtime-sdk/`: Uses environment variables from host application

## Testing Structure

Tests are organized in the `test/` directory:

- `production-test/`: Integration tests for SDK functionality
- Future: Unit tests will be added to each component's directory

## Documentation Organization

Technical documentation is centralized in the `docs/` directory:

- Architecture diagrams and system design
- API specifications and testing guides
- Component-specific design documents
- Edge case handling and troubleshooting

## Build Artifacts

The following directories contain build output and are gitignored:

- `.next/`: Next.js build cache and output
- `dist/`: Compiled TypeScript output
- `out/`: Extension compiled output
- `node_modules/`: Package dependencies
- `.env`: Environment configuration files

## Version Control

The `.git/` directory contains repository metadata. The `.gitignore` file excludes:

- Build artifacts
- Dependencies
- Environment files
- IDE-specific files
- Log files

This structure supports a clean separation of concerns, making it easy to navigate the codebase and understand the role of each component.
