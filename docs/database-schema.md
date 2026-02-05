# Database Schema

## Core Principles
- Backend is stateless; DB is the only source of truth
- All queries are fresh (no caching layer in MVP)
- Explicit relationships, no inference

---

## Tables

### `users`
Stores authenticated users (GitHub OAuth).

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  github_id INTEGER UNIQUE NOT NULL,
  github_login VARCHAR(255) NOT NULL,
  github_email VARCHAR(255),
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_github_id ON users(github_id);
```

**Notes:**
- `github_id` is the stable identifier from GitHub OAuth
- `github_login` is the username (e.g., `arin`)
- Used for both dashboard and IDE extension authentication

---

### `projects`
Explicit mapping: project ↔ repo ↔ owner.

```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id VARCHAR(64) UNIQUE NOT NULL, -- e.g., proj_abc123
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- GitHub repo info
  repo_owner VARCHAR(255) NOT NULL, -- e.g., "arin"
  repo_name VARCHAR(255) NOT NULL,  -- e.g., "checkout-api"
  repo_full_name VARCHAR(512) NOT NULL, -- "arin/checkout-api"
  
  -- Deployment platform
  platform VARCHAR(50) NOT NULL DEFAULT 'vercel', -- MVP: only 'vercel'
  
  -- API keys
  ingest_api_key VARCHAR(128) UNIQUE NOT NULL, -- for SDK
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(repo_full_name) -- one project per repo in MVP
);

CREATE INDEX idx_projects_project_id ON projects(project_id);
CREATE INDEX idx_projects_repo_full_name ON projects(repo_full_name);
CREATE INDEX idx_projects_owner_id ON projects(owner_id);
CREATE INDEX idx_projects_ingest_key ON projects(ingest_api_key);
```

**Notes:**
- `project_id` is the public identifier (shown to user)
- `ingest_api_key` is the SDK authentication key
- `repo_full_name` enforces one project per repo (MVP constraint)
- `owner_id` links to the user who created the project

---

### `incidents`
Core entity: represents a production error.

```sql
CREATE TABLE incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id VARCHAR(64) UNIQUE NOT NULL, -- e.g., inc_xyz789
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  
  -- Error metadata
  error_message TEXT NOT NULL,
  error_type VARCHAR(255), -- e.g., "TypeError", "ReferenceError"
  stack_trace TEXT,
  
  -- Source location (correlated from stack trace)
  file_path VARCHAR(1024), -- relative to repo root, e.g., "src/handlers/checkout.ts"
  line_number INTEGER,
  column_number INTEGER,
  
  -- Deployment context
  commit_sha VARCHAR(40) NOT NULL, -- Git commit SHA
  deployment_id VARCHAR(255), -- platform-specific (e.g., Vercel deployment ID)
  environment VARCHAR(50) NOT NULL, -- "production" or "preview"
  
  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'open', -- 'open' or 'resolved'
  
  -- Timestamps
  occurred_at TIMESTAMP NOT NULL, -- when error happened in production
  created_at TIMESTAMP DEFAULT NOW(), -- when incident was created in DB
  resolved_at TIMESTAMP,
  
  -- Metadata
  metadata JSONB -- extensible field for platform-specific data
);

CREATE INDEX idx_incidents_incident_id ON incidents(incident_id);
CREATE INDEX idx_incidents_project_id ON incidents(project_id);
CREATE INDEX idx_incidents_status ON incidents(status);
CREATE INDEX idx_incidents_occurred_at ON incidents(occurred_at DESC);
CREATE INDEX idx_incidents_commit_sha ON incidents(commit_sha);
```

**Notes:**
- `incident_id` is the public identifier
- `file_path` is **relative to repo root** (critical for IDE extension)
- `commit_sha` enables correlation with local git state
- `status` is simple: `open` or `resolved` (no complex state machine in MVP)
- `metadata` JSONB allows extensibility without schema changes

---

### `api_keys`
Audit trail for API key usage (optional but recommended).

```sql
CREATE TABLE api_key_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  key_type VARCHAR(50) NOT NULL, -- 'ingest'
  last_used_at TIMESTAMP DEFAULT NOW(),
  usage_count BIGINT DEFAULT 0,
  
  UNIQUE(project_id, key_type)
);

CREATE INDEX idx_api_key_usage_project_id ON api_key_usage(project_id);
```

**Notes:**
- Tracks when ingest keys were last used
- Helps detect stale projects or key leaks
- Not critical for MVP but good practice

---

## Relationships

```
users (1) ──< (N) projects
projects (1) ──< (N) incidents
projects (1) ──< (N) api_key_usage
```

---

## Data Flow

### Ingest Flow (SDK → Backend)
1. SDK sends telemetry with `ingest_api_key`
2. Backend validates key → finds `project_id`
3. Backend creates `incident` record
4. Backend updates `api_key_usage.last_used_at`

### Query Flow (IDE Extension → Backend)
1. Extension sends `repo_full_name` + user auth token
2. Backend validates user token
3. Backend finds `project` by `repo_full_name`
4. Backend queries `incidents` where `project_id` matches and `status = 'open'`
5. Backend returns incidents

---

## Edge Cases

### Multiple Users, Same Repo
**MVP:** Not supported. One repo = one project = one owner.
**Future:** Add `project_members` table for team access.

### Deleted GitHub Repo
**Behavior:** Project remains in DB (soft delete pattern).
**Rationale:** Historical incidents still valuable.

### Key Rotation
**MVP:** Not supported. User must create new project.
**Future:** Add `api_keys` table with versioning.

### Incident Deduplication
**MVP:** Not implemented. Every error = new incident.
**Future:** Add fingerprinting (hash of error type + file + line).

---

## Security Considerations

### API Key Storage
- `ingest_api_key` stored as plaintext (acceptable for ingest-only keys)
- Keys are UUIDs or cryptographically random strings
- Keys are scoped per project (blast radius limited)

### User Authentication
- GitHub OAuth tokens stored securely (hashed/encrypted)
- Session tokens use short TTL (e.g., 1 hour)
- No API keys stored in IDE extension

### Data Isolation
- All queries filtered by `owner_id` or `repo_full_name`
- No cross-project data leakage
- Incidents only visible to project owner

---

## Migration Strategy

### Initial Schema
```bash
# Run migrations in order:
1. 001_create_users.sql
2. 002_create_projects.sql
3. 003_create_incidents.sql
4. 004_create_api_key_usage.sql
```

### Rollback Plan
- Each migration has a corresponding `down` migration
- Use transaction-based migrations (all-or-nothing)

---

## Performance Considerations

### Query Patterns
- Most common: `SELECT * FROM incidents WHERE project_id = ? AND status = 'open'`
- Index on `(project_id, status)` composite key recommended
- Pagination required for large incident counts

### Scaling
- **MVP:** Single Postgres instance sufficient
- **Future:** Read replicas for IDE extension queries
- **Future:** Partitioning `incidents` by `occurred_at` (time-series data)

---

## Monitoring

### Key Metrics
- Incident creation rate (per project)
- API key usage frequency
- Query latency (P50, P95, P99)
- Incident resolution time

### Alerts
- Spike in incident creation (possible production outage)
- Unused API keys (stale projects)
- Failed authentication attempts (security)
