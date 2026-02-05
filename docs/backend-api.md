# Backend API Specification

## Authentication

### User Authentication (Dashboard + IDE Extension)
- **Method:** GitHub OAuth 2.0
- **Flow:** Authorization Code Grant
- **Token Storage:** HTTP-only cookies (dashboard) or secure storage (IDE)
- **Token TTL:** 1 hour (refresh token: 30 days)

### SDK Authentication (Ingest)
- **Method:** API Key (Bearer token)
- **Header:** `Authorization: Bearer <ingest_api_key>`
- **Scope:** Write-only to `/api/ingest`

---

## API Endpoints

### **1. Authentication**

#### `POST /api/auth/github/callback`
Complete GitHub OAuth flow.

**Request:**
```json
{
  "code": "github_oauth_code"
}
```

**Response:**
```json
{
  "user": {
    "id": "usr_abc123",
    "github_login": "arin",
    "avatar_url": "https://..."
  },
  "token": "jwt_token_here"
}
```

**Errors:**
- `400` Invalid OAuth code
- `500` GitHub API error

---

#### `POST /api/auth/logout`
Invalidate session.

**Request:** None (uses cookie/token)

**Response:**
```json
{
  "success": true
}
```

---

#### `GET /api/auth/me`
Get current authenticated user.

**Headers:** `Authorization: Bearer <user_token>`

**Response:**
```json
{
  "id": "usr_abc123",
  "github_login": "arin",
  "github_email": "arin@example.com",
  "avatar_url": "https://..."
}
```

**Errors:**
- `401` Unauthorized

---

### **2. Projects (Dashboard)**

#### `POST /api/projects`
Create a new project.

**Headers:** `Authorization: Bearer <user_token>`

**Request:**
```json
{
  "repo_owner": "arin",
  "repo_name": "checkout-api",
  "platform": "vercel"
}
```

**Response:**
```json
{
  "project": {
    "id": "proj_abc123",
    "repo_full_name": "arin/checkout-api",
    "platform": "vercel",
    "ingest_api_key": "key_xyz789_SHOW_ONCE",
    "created_at": "2026-02-06T03:00:00Z"
  }
}
```

**Errors:**
- `400` Invalid repo format
- `409` Project already exists for this repo
- `401` Unauthorized

**Security:**
- Verify user has access to GitHub repo (call GitHub API)
- Generate cryptographically random `ingest_api_key`
- Return key **only once** (never retrievable again)

---

#### `GET /api/projects`
List all projects for authenticated user.

**Headers:** `Authorization: Bearer <user_token>`

**Response:**
```json
{
  "projects": [
    {
      "id": "proj_abc123",
      "repo_full_name": "arin/checkout-api",
      "platform": "vercel",
      "incident_count": 3,
      "created_at": "2026-02-06T03:00:00Z"
    }
  ]
}
```

**Errors:**
- `401` Unauthorized

---

#### `GET /api/projects/:projectId`
Get project details.

**Headers:** `Authorization: Bearer <user_token>`

**Response:**
```json
{
  "project": {
    "id": "proj_abc123",
    "repo_full_name": "arin/checkout-api",
    "platform": "vercel",
    "created_at": "2026-02-06T03:00:00Z",
    "recent_incidents": [
      {
        "id": "inc_xyz789",
        "error_message": "Cannot read property 'id' of undefined",
        "file_path": "src/handlers/checkout.ts",
        "line_number": 42,
        "status": "open",
        "occurred_at": "2026-02-06T02:30:00Z"
      }
    ]
  }
}
```

**Errors:**
- `401` Unauthorized
- `404` Project not found
- `403` Forbidden (not project owner)

---

#### `DELETE /api/projects/:projectId`
Delete a project (soft delete).

**Headers:** `Authorization: Bearer <user_token>`

**Response:**
```json
{
  "success": true
}
```

**Errors:**
- `401` Unauthorized
- `404` Project not found
- `403` Forbidden

**Notes:**
- Soft delete: set `deleted_at` timestamp
- Incidents remain in DB for audit trail
- API key is invalidated immediately

---

### **3. Incidents (IDE Extension)**

#### `GET /api/incidents`
Query incidents for a repository.

**Headers:** `Authorization: Bearer <user_token>`

**Query Parameters:**
- `repo` (required): `owner/repo` format (e.g., `arin/checkout-api`)
- `status` (optional): `open` or `resolved` (default: `open`)
- `limit` (optional): max results (default: 50, max: 100)
- `offset` (optional): pagination offset (default: 0)

**Request:**
```
GET /api/incidents?repo=arin/checkout-api&status=open&limit=10
```

**Response:**
```json
{
  "incidents": [
    {
      "id": "inc_xyz789",
      "error_message": "Cannot read property 'id' of undefined",
      "error_type": "TypeError",
      "stack_trace": "TypeError: Cannot read property...\n  at checkout.ts:42:10",
      "file_path": "src/handlers/checkout.ts",
      "line_number": 42,
      "column_number": 10,
      "commit_sha": "a1b2c3d4e5f6",
      "environment": "production",
      "status": "open",
      "occurred_at": "2026-02-06T02:30:00Z",
      "created_at": "2026-02-06T02:30:15Z"
    }
  ],
  "pagination": {
    "total": 3,
    "limit": 10,
    "offset": 0
  }
}
```

**Errors:**
- `401` Unauthorized
- `400` Invalid repo format
- `404` Project not found for repo

**Security:**
- Verify user owns the project for this repo
- Filter incidents by `project_id` derived from `repo_full_name`

---

#### `PATCH /api/incidents/:incidentId`
Update incident status.

**Headers:** `Authorization: Bearer <user_token>`

**Request:**
```json
{
  "status": "resolved"
}
```

**Response:**
```json
{
  "incident": {
    "id": "inc_xyz789",
    "status": "resolved",
    "resolved_at": "2026-02-06T03:00:00Z"
  }
}
```

**Errors:**
- `401` Unauthorized
- `404` Incident not found
- `403` Forbidden (not project owner)
- `400` Invalid status value

---

### **4. Ingest (SDK)**

#### `POST /api/ingest`
Receive telemetry from SDK.

**Headers:** `Authorization: Bearer <ingest_api_key>`

**Request:**
```json
{
  "error": {
    "message": "Cannot read property 'id' of undefined",
    "type": "TypeError",
    "stack": "TypeError: Cannot read property...\n  at checkout.ts:42:10"
  },
  "context": {
    "commit_sha": "a1b2c3d4e5f6",
    "deployment_id": "dpl_vercel_123",
    "environment": "production",
    "occurred_at": "2026-02-06T02:30:00Z"
  },
  "metadata": {
    "platform": "vercel",
    "region": "us-east-1",
    "runtime": "nodejs20.x"
  }
}
```

**Response:**
```json
{
  "incident_id": "inc_xyz789",
  "status": "created"
}
```

**Errors:**
- `401` Invalid API key
- `400` Missing required fields
- `429` Rate limit exceeded
- `500` Internal server error

**Processing Logic:**
1. Validate `ingest_api_key` → find `project_id`
2. Parse stack trace → extract `file_path`, `line_number`, `column_number`
3. Create `incident` record in DB
4. Update `api_key_usage.last_used_at`
5. Return `incident_id`

**Stack Trace Parsing:**
```
Input: "TypeError: Cannot read property...\n  at checkout.ts:42:10"
Output: { file: "src/handlers/checkout.ts", line: 42, column: 10 }
```

**Edge Cases:**
- Stack trace parsing fails → store raw stack, set `file_path = null`
- Missing `commit_sha` → reject request (required field)
- Duplicate error → create new incident (no deduplication in MVP)

---

## Rate Limiting

### Ingest Endpoint
- **Limit:** 1000 requests per minute per project
- **Rationale:** Prevent runaway error loops from overwhelming backend
- **Response:** `429 Too Many Requests` with `Retry-After` header

### Query Endpoints (IDE Extension)
- **Limit:** 60 requests per minute per user
- **Rationale:** IDE polls every 30-60 seconds
- **Response:** `429 Too Many Requests`

### Dashboard Endpoints
- **Limit:** 100 requests per minute per user
- **Rationale:** Human interaction, not automated

---

## Error Responses

### Standard Error Format
```json
{
  "error": {
    "code": "INVALID_REPO_FORMAT",
    "message": "Repository must be in 'owner/repo' format",
    "details": {
      "field": "repo",
      "provided": "invalid-format"
    }
  }
}
```

### Error Codes
- `UNAUTHORIZED` - Missing or invalid auth token
- `FORBIDDEN` - Valid token, insufficient permissions
- `NOT_FOUND` - Resource does not exist
- `INVALID_REQUEST` - Malformed request body
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `INTERNAL_ERROR` - Server error (never expose details)

---

## Security Considerations

### API Key Validation
```typescript
// Constant-time comparison to prevent timing attacks
function validateApiKey(provided: string, stored: string): boolean {
  return crypto.timingSafeEqual(
    Buffer.from(provided),
    Buffer.from(stored)
  );
}
```

### CORS Policy
- **Dashboard:** Same-origin only
- **IDE Extension:** No CORS (uses direct HTTPS)
- **SDK:** No CORS (server-to-server)

### Input Validation
- **Repo format:** `^[a-zA-Z0-9_-]+/[a-zA-Z0-9_-]+$`
- **Commit SHA:** `^[a-f0-9]{40}$` (full SHA-1)
- **Environment:** Enum `['production', 'preview']`
- **Status:** Enum `['open', 'resolved']`

### SQL Injection Prevention
- Use parameterized queries (never string concatenation)
- ORM with prepared statements (e.g., Prisma, TypeORM)

---

## Observability

### Logging
- **Ingest requests:** Log `project_id`, `commit_sha`, `error_type`
- **Auth failures:** Log `user_id`, `endpoint`, `reason`
- **Rate limits:** Log `user_id`, `endpoint`, `limit_type`

### Metrics
- Request latency (P50, P95, P99)
- Error rate (5xx responses)
- Ingest throughput (events/sec)
- Incident creation rate

### Tracing
- Distributed tracing for ingest flow (SDK → Backend → DB)
- Trace ID in response headers for debugging

---

## Deployment

### Environment Variables
```bash
DATABASE_URL=postgresql://...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
JWT_SECRET=...
API_BASE_URL=https://api.yourtool.com
RATE_LIMIT_REDIS_URL=redis://...
```

### Health Checks
```
GET /health
Response: { "status": "ok", "db": "connected", "uptime": 12345 }
```

### Graceful Shutdown
- Stop accepting new requests
- Finish in-flight requests (30s timeout)
- Close DB connections
- Exit with code 0
