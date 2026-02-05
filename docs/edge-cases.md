# Edge Cases & Failure Modes

## Critical Failure Scenarios

This document catalogs edge cases, failure modes, and how the system handles them.

---

## 1. SDK Failures

### Missing Configuration

**Scenario:** User forgets to set `ROOTLY_API_KEY` environment variable.

**Behavior:**
```typescript
// SDK initialization
init({
  projectId: 'proj_abc123',
  apiKey: process.env.ROOTLY_API_KEY, // undefined
});

// Result: SDK logs warning and disables itself
// Application continues running normally
```

**Impact:** No telemetry sent, but production app unaffected.

---

### Invalid API Key

**Scenario:** User sets wrong API key or key is revoked.

**Behavior:**
1. SDK sends telemetry with invalid key
2. Backend returns `401 Unauthorized`
3. SDK logs warning and disables itself
4. No retries (client error)

**Impact:** Silent failure. User must check logs or dashboard to detect.

**Mitigation:** Dashboard shows "Last seen" timestamp for each project.

---

### Network Failures

**Scenario:** Backend is unreachable (DNS failure, timeout, etc.).

**Behavior:**
1. SDK attempts to send telemetry
2. Network error occurs
3. SDK queues event and retries with exponential backoff
4. After 3 retries, event is dropped

**Impact:** Some errors may be lost during outages.

**Mitigation:** Queue up to 100 events in memory (FIFO).

---

### Rate Limiting

**Scenario:** Application has error loop, sends 10,000 errors/sec.

**Behavior:**
1. Backend rate limits at 1000 req/min per project
2. Returns `429 Too Many Requests`
3. SDK drops events (no retry)

**Impact:** Some errors not recorded.

**Mitigation:** User must fix error loop. Dashboard shows rate limit alerts.

---

### Stack Trace Parsing Failure

**Scenario:** Error has malformed stack trace or non-standard format.

**Behavior:**
1. SDK sends raw stack trace to backend
2. Backend attempts to parse
3. Parsing fails → `file_path = null`, `line_number = null`
4. Incident created with raw stack only

**Impact:** IDE extension cannot highlight line, but incident still visible.

**Mitigation:** User can view full stack trace in dashboard.

---

### Missing Commit SHA

**Scenario:** Deployment platform doesn't provide commit SHA env var.

**Behavior:**
1. SDK tries to read `VERCEL_GIT_COMMIT_SHA`
2. Variable is undefined
3. SDK **rejects** the event (commit SHA is required)

**Impact:** No incident created.

**Rationale:** Without commit SHA, we cannot correlate error to code.

**Mitigation:** User must configure deployment platform correctly.

---

## 2. Backend Failures

### Database Connection Lost

**Scenario:** Postgres database becomes unreachable.

**Behavior:**
1. API request arrives
2. Query fails with connection error
3. Backend returns `503 Service Unavailable`
4. Backend attempts to reconnect (exponential backoff)

**Impact:** All API requests fail until DB is restored.

**Mitigation:** 
- Health check endpoint (`/health`) shows DB status
- Monitoring alerts on-call engineer
- SDK retries (for ingest)
- IDE extension retries next poll cycle

---

### Invalid Ingest Payload

**Scenario:** SDK sends malformed JSON or missing required fields.

**Behavior:**
1. Backend validates payload
2. Validation fails
3. Returns `400 Bad Request` with error details

**Impact:** Event not recorded.

**Mitigation:** SDK has schema validation before sending.

---

### Duplicate Incidents

**Scenario:** Same error occurs 100 times in 1 minute.

**Behavior (MVP):**
- Create 100 separate incidents
- No deduplication

**Impact:** Noisy incident list.

**Future Enhancement:** Fingerprinting (hash of error type + file + line).

---

### Orphaned Incidents

**Scenario:** User deletes project, but incidents remain in DB.

**Behavior:**
1. Project soft-deleted (`deleted_at` set)
2. Incidents remain (foreign key cascade prevented)
3. Incidents not returned in API queries

**Impact:** Historical data preserved for audit.

**Mitigation:** Periodic cleanup job (delete incidents older than 90 days).

---

## 3. IDE Extension Failures

### Not Logged In

**Scenario:** User opens VS Code without logging in.

**Behavior:**
1. Extension activates
2. Checks for token in `SecretStorage`
3. Token not found
4. Shows "Login to Rootly" button in sidebar

**Impact:** No incidents shown.

---

### Repo Not Mapped to Project

**Scenario:** User opens repo that doesn't have a Rootly project.

**Behavior:**
1. Extension detects repo from `.git/config`
2. Polls backend: `GET /api/incidents?repo=arin/unmapped-repo`
3. Backend returns `404 Not Found`
4. Extension shows "No project found for this repo"

**Impact:** No incidents shown.

**Mitigation:** Extension shows "Create Project" button → opens dashboard.

---

### File Not Found Locally

**Scenario:** Incident references `src/checkout.ts:42`, but user is on different commit.

**Behavior:**
1. Extension tries to open file
2. File doesn't exist or line number is different
3. Shows warning: "File not found. You may be on a different commit."
4. Offers "View Commit on GitHub" button

**Impact:** Cannot jump to line, but incident still visible.

---

### Network Error During Poll

**Scenario:** User's internet connection drops.

**Behavior:**
1. Poll fails with network error
2. Extension logs error
3. Retries next poll cycle (30-60s later)

**Impact:** Incidents not updated until network restored.

---

### Token Expired

**Scenario:** JWT token expires (1 hour TTL).

**Behavior:**
1. Poll request sent with expired token
2. Backend returns `401 Unauthorized`
3. Extension shows "Session expired. Please log in again."
4. Clears token from `SecretStorage`

**Impact:** User must re-authenticate.

**Future Enhancement:** Refresh tokens (30-day TTL).

---

### Multiple Workspaces Open

**Scenario:** User has multiple VS Code windows open with different repos.

**Behavior (MVP):**
- Each window runs separate extension instance
- Each polls independently
- No shared state

**Impact:** Increased API load (acceptable for MVP).

**Future Enhancement:** Shared extension host process.

---

## 4. Dashboard Failures

### GitHub OAuth Failure

**Scenario:** GitHub is down or OAuth app is misconfigured.

**Behavior:**
1. User clicks "Login with GitHub"
2. Redirect to GitHub fails or returns error
3. Dashboard shows "GitHub login failed. Please try again."

**Impact:** User cannot log in.

**Mitigation:** Retry or contact support.

---

### Project Already Exists

**Scenario:** User tries to create project for repo that already has one.

**Behavior:**
1. Dashboard sends `POST /api/projects`
2. Backend checks `projects.repo_full_name` (unique constraint)
3. Returns `409 Conflict`
4. Dashboard shows "Project already exists for this repo"

**Impact:** User cannot create duplicate project.

**Mitigation:** Show existing project instead.

---

### API Key Displayed Only Once

**Scenario:** User closes dashboard before copying API key.

**Behavior:**
1. Project created, API key shown
2. User closes tab
3. API key is **never shown again**

**Impact:** User must delete project and create new one.

**Rationale:** Security best practice (treat like password).

**Mitigation:** Clear warning: "Copy this key now. You won't see it again."

---

## 5. Cross-Component Failures

### Clock Skew

**Scenario:** Production server clock is 5 minutes ahead of backend.

**Behavior:**
1. SDK sends `occurred_at: 2026-02-06T03:05:00Z`
2. Backend receives at `2026-02-06T03:00:00Z`
3. Incident appears to be "from the future"

**Impact:** Confusing timestamps in UI.

**Mitigation:** Backend validates `occurred_at` is within ±10 minutes of server time.

---

### Commit SHA Mismatch

**Scenario:** User's local repo is on commit `abc123`, but incident is from `def456`.

**Behavior:**
1. Extension shows incident for `src/checkout.ts:42`
2. User's local file has different code at line 42
3. Highlighted line doesn't match error

**Impact:** Confusing for user.

**Mitigation:** 
- Show commit SHA in incident tooltip
- Offer "View Commit on GitHub" button
- Future: Fetch file content from GitHub at specific commit

---

### Deleted GitHub Repo

**Scenario:** User deletes GitHub repo after creating Rootly project.

**Behavior:**
1. Project remains in DB
2. SDK continues sending telemetry (still works)
3. IDE extension cannot detect repo (`.git/config` missing)

**Impact:** SDK works, IDE extension doesn't.

**Mitigation:** User must delete Rootly project manually.

---

### Vercel Deployment Without Git

**Scenario:** User deploys to Vercel without linking GitHub repo.

**Behavior:**
1. Vercel doesn't set `VERCEL_GIT_COMMIT_SHA`
2. SDK cannot extract commit SHA
3. SDK rejects events

**Impact:** No telemetry sent.

**Mitigation:** User must link GitHub repo in Vercel settings.

---

## 6. Security Edge Cases

### API Key Leaked

**Scenario:** User accidentally commits `ROOTLY_API_KEY` to public repo.

**Behavior:**
1. Attacker finds key
2. Attacker sends fake telemetry
3. Backend accepts (key is valid)

**Impact:** Polluted incident data.

**Mitigation:**
- Dashboard shows "Last used" timestamp and IP address
- User can revoke key (delete project, create new one)
- Future: Key rotation without deleting project

---

### JWT Token Stolen

**Scenario:** Attacker steals user's JWT token.

**Behavior:**
1. Attacker makes API requests with stolen token
2. Backend accepts (token is valid)
3. Attacker can view incidents for user's projects

**Impact:** Data breach (read-only).

**Mitigation:**
- Short TTL (1 hour)
- Refresh tokens stored securely
- IP-based anomaly detection (future)

---

### SQL Injection Attempt

**Scenario:** Attacker sends malicious `repo` parameter.

**Request:**
```
GET /api/incidents?repo=arin/test'; DROP TABLE incidents; --
```

**Behavior:**
1. Backend uses parameterized queries
2. Query safely escapes input
3. No SQL injection occurs

**Impact:** None (attack fails).

---

### XSS in Error Messages

**Scenario:** Attacker throws error with malicious message.

**Code:**
```javascript
throw new Error('<script>alert("XSS")</script>');
```

**Behavior:**
1. SDK sends error message as-is
2. Backend stores in DB
3. Dashboard/IDE renders with proper escaping

**Impact:** None (XSS prevented by output escaping).

---

## 7. Data Consistency Edge Cases

### Race Condition: Concurrent Project Creation

**Scenario:** Two users try to create project for same repo simultaneously.

**Behavior:**
1. Both send `POST /api/projects` at same time
2. Database unique constraint on `repo_full_name`
3. One succeeds, one gets `409 Conflict`

**Impact:** One user must refresh and see existing project.

---

### Race Condition: Incident Status Update

**Scenario:** User marks incident as resolved in dashboard and IDE simultaneously.

**Behavior:**
1. Both send `PATCH /api/incidents/:id` with `status: resolved`
2. Both succeed (idempotent operation)
3. `resolved_at` timestamp is from last request

**Impact:** Minimal (both achieve same result).

---

### Stale Data in IDE

**Scenario:** User resolves incident in dashboard, but IDE still shows it as open.

**Behavior:**
1. Dashboard updates incident
2. IDE polls every 30-60s
3. IDE shows stale data for up to 60s

**Impact:** Temporary inconsistency.

**Mitigation:** "Refresh" button in IDE extension.

---

## 8. Platform-Specific Edge Cases

### Vercel Preview Deployments

**Scenario:** User deploys preview branch, error occurs.

**Behavior:**
1. SDK detects `VERCEL_ENV=preview`
2. Sends telemetry with `environment: preview`
3. Backend creates incident
4. IDE extension shows preview incidents (if `status=open`)

**Impact:** Preview errors mixed with production errors.

**Future Enhancement:** Filter by environment in IDE.

---

### Serverless Cold Starts

**Scenario:** Lambda function cold starts, SDK initialization takes 500ms.

**Behavior:**
1. First request is slower
2. SDK initializes on first error
3. Subsequent errors are fast

**Impact:** Minimal (one-time cost).

---

### Memory Limits

**Scenario:** Lambda function has 128MB memory, SDK queue uses 10MB.

**Behavior:**
1. SDK queue grows to max size (100 events)
2. Older events dropped (FIFO)
3. Function doesn't run out of memory

**Impact:** Some events lost if queue fills.

**Mitigation:** Reduce `maxQueueSize` in config.

---

## Summary

| Category | Critical Failures | Mitigation |
|----------|-------------------|------------|
| SDK | Network errors, rate limits | Queue + retry, drop on 429 |
| Backend | DB connection lost | Health checks, auto-reconnect |
| IDE | File not found, token expired | Show warnings, prompt re-auth |
| Dashboard | OAuth failure, key lost | Retry, clear warnings |
| Security | Key leaked, token stolen | Short TTL, revocation |
| Data | Race conditions, stale data | Idempotent ops, polling |

**Key Principle:** Fail gracefully. Never crash production apps.
