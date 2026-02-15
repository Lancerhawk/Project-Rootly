# Rootly Web App

This folder contains the Phase 1 web application with backend and frontend.

**Current Version:** 1.2.5

## Structure

```
webapp/
├── backend/     # Express.js API + Prisma
└── frontend/    # Next.js web app
```

## Database

Using **Supabase PostgreSQL**.

### Setup Supabase

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get your connection string from Settings → Database
4. Copy to `backend/.env` as `DATABASE_URL`

## Getting Started

### Backend

```bash
cd webapp/backend
npm install
cp .env.example .env
# Edit .env with your Supabase credentials
npm run db:generate
npm run db:migrate
npm run dev
```

### Frontend

```bash
cd webapp/frontend
npm install
npm run dev
```

## GitHub OAuth Setup

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create new OAuth App:
   - Application name: `Rootly Dev`
   - Homepage URL: `http://localhost:3000`
   - Callback URL: `http://localhost:3001/auth/github/callback`
3. Copy Client ID and Client Secret to `backend/.env`
