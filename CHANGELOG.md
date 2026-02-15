# Changelog

All notable changes to Rootly will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---


## [1.2.5] - 2026-02-15
### IDE Extension (v1.1.4)
- **Multi-File Stack Traces**: Added support for parsing and navigating all file locations in a stack trace, allowing developers to trace the full chain of failure.
- **Improved UI**: Cleaned up file path display in incident lists and details view to show `filename:line` format.
- **Platform Support**: Fixed path parsing for Windows file paths in stack traces.

## [1.2.4] - 2026-02-15

### 🐛 IDE Extension Fixes

#### rootly-vscode v1.1.3
- **Path Resolution**: "Go to Error" now correctly handles absolute paths from the same machine (no more "File not found" for local setups)
- **Fuzzy Matching**: Improved workspace file search to correctly find files even if they are in `node_modules` when the path suggests it
- **Code Duplication**: Refactored navigation logic to be consistent between command palette and sidebar clicks

---

## [1.2.3] - 2026-02-14

### 🔒 SDK Security Update

#### rootly-runtime v1.2.8
- **Externalized API Configuration**: API URL is now injected at build time via `.env`
- **Security**: Source code no longer contains hardcoded backend URLs
- **Zero-Config**: Generated package works out-of-the-box with default URL
- **Build System**: Added custom build script for environment injection
- Published to npm

---

## [1.2.2] - 2026-02-10

### SDK Updates

#### rootly-runtime v1.2.6
- Fixed Express middleware error detection to check err.status, err.statusCode, or res.statusCode
- Ensures 5xx errors are captured even when response status is not explicitly set
- Published to npm

#### rootly-runtime v1.2.5
- Added fallback commit SHA mechanism for local development
- Provides default 40-character hex SHA when environment variables unavailable
- Prevents backend validation errors in non-deployed environments
- Published to npm

### IDE Extension Updates

#### VS Code Extension v1.1.2
- Fixed file path resolution to extract filename from absolute Windows paths
- Go to Error Location now works regardless of workspace root directory
- Published to VS Code Marketplace

#### VS Code Extension v1.1.1
- Updated stack trace parsing regex to handle Windows paths with spaces
- File locations now display correctly in incident list (format: filename:line)
- Published to VS Code Marketplace

### Fixed
- Express 5xx errors now captured correctly by SDK
- SDK functions in local development without Git environment variables
- IDE extension file navigation works at any workspace level
- Stack traces with Windows paths containing spaces parse correctly

---

## [1.2.0] - 2026-02-09

### 🎉 Runtime SDK Production Hardening

This release hardens the `rootly-runtime` SDK for production use with critical bug fixes, performance improvements, and a cleaner public API. The SDK is now production-ready with 283 lines of code (17 under the 300-line target).

### Added

#### SDK Production Features
- **Environment Normalization** - Automatic normalization to `production` or `preview`
  - Falls back to `process.env.NODE_ENV` when not specified
  - Prevents dev errors being marked as production incidents
- **Severity Support** - Capture errors with severity levels (`error`, `warning`, `info`)
- **Debug Mode** - Optional debug logging to stderr for visibility
- **Recursive Capture Protection** - Symbol flag prevents infinite loops if SDK throws
- **Stable Fingerprinting** - Improved error deduplication with normalized whitespace
- **Hard Memory Cap** - Max 500 fingerprints with auto-cleanup (prevents unbounded growth)
- **Real Graceful Shutdown** - Tracks pending HTTP requests for clean shutdowns

#### API Improvements
- **Clean Public API** - Removed `apiUrl` from `InitOptions`
  - Normal users no longer configure backend URL
  - Advanced users can use `ROOTLY_API_URL` env variable
  - Makes SDK feel like a professional SaaS product

### Changed

#### Performance Optimizations
- **Optimized Rate Limiter** - O(n) instead of O(n²) performance
- **Debug Logging** - Uses `process.stderr.write` for production-grade output

#### API Changes
- **InitOptions Interface** - Simplified to `{ apiKey, environment?, debug? }`
  - Removed `apiUrl` parameter from public API
  - Use `ROOTLY_API_URL` env variable for custom backends

### Fixed

#### Critical SDK Bug Fixes
- **Environment Fallback** - Now uses `NODE_ENV` when environment not specified
- **Listener Guard Bug** - SDK now always registers error handlers (was silently disabled)
- **Transport Decrement Bug** - Fixed `pendingRequests` counter (could go negative)
- **Severity Default** - Uses nullish coalescing (`??`) for safer edge case handling

### Technical Details

- **SDK Version**: 1.2.0
- **Line Count**: 283 lines (17 under 300 target)
- **Dependencies**: Zero (only native Node.js modules)
- **Backward Compatibility**: Fully backward compatible

### Files Modified

- `runtime-sdk/package.json` - Version updated to 1.2.0
- `runtime-sdk/src/index.ts` - Environment fallback, removed apiUrl, listener guards
- `runtime-sdk/src/runtime.ts` - Severity support, stable fingerprinting, debug mode
- `runtime-sdk/src/transport.ts` - Graceful shutdown tracking
- `runtime-sdk/README.md` - Comprehensive documentation with v1.2.0 features
- `runtime-sdk/CHANGELOG.md` - Detailed SDK changelog

---

## [1.1.0] - 2026-02-08

### 🎉 IDE Extension Release

This major release introduces the VS Code extension with professional UI, Go to Error functionality, and real-time incident notifications directly in your IDE.

### Added

#### VS Code Extension Features
- **Go to Error Location**: One-click navigation to exact file and line where errors occurred
  - Automatic stack trace parsing for TypeScript, JavaScript, Python, Java, Go, Ruby, and PHP
  - Workspace file search with `node_modules` exclusion
  - Opens files directly in VS Code at the error line
- **Expandable Incident Cards**: Click incidents in sidebar to see detailed information
  - Environment badges (Production, Staging, Development)
  - Timestamps with "time ago" formatting
  - Commit SHA display (first 7 characters)
  - "View Full Details" button
- **New Incident Notifications**: Desktop alerts when new incidents are detected
  - "View Incidents" action button
  - Only alerts for newly detected incidents (not on initial load)
  - Incident tracking with Set data structure
- **Manual Refresh**: Rate-limited refresh button in toolbar
  - 5 refreshes per 2-minute window
  - Prevents API abuse
  - Clear user feedback on rate limits
- **Professional UI Redesign**: Clean, minimal interface throughout
  - VS Code native icons (removed emoji-based icons)
  - Theme-aware styling using CSS variables
  - Better visual hierarchy and spacing
  - Professional incident details panel

#### Backend Improvements
- **Enhanced OAuth Flow**: Minimal, professional IDE authentication page
  - Dark theme matching webapp aesthetic (#0a0a0a background)
  - Clean token display with copy-to-clipboard
  - Consistent branding across webapp and extension
- **Fixed OAuth Bugs**: Resolved "headers already sent" error in IDE authentication
- **Improved Session Handling**: Manual cookie signing with `cookie-signature` for IDE auth

### Changed
- Extension version updated from 0.1.0 to 1.1.0
- Incident tree view now uses collapsible items instead of flat list
- OAuth callback page redesigned for professional appearance
- Sidebar UI completely redesigned with expandable cards

### Technical Details

#### Extension
- **Stack Trace Regex**: `/(?:at\s+|\()([^\s()]+\.(ts|js|tsx|jsx|py|java|go|rb|php)):(\d+)(?::(\d+))?/`
- **Commands Added**: `rootly.goToError` for navigation
- **Incident Tracking**: `previousIncidentIds` Set for notification deduplication
- **Rate Limiting**: 5 refreshes per 2-minute sliding window
- **Icons**: ThemeIcon with proper colors (arrow-right, server-environment, clock, git-commit)

#### Backend
- **Files Modified**: `webapp/backend/src/routes/oauth.ts`
- **Cookie Signing**: Manual signing using `cookie-signature` library
- **Return Statement**: Added to prevent double response sending

#### Documentation
- **README.md**: Comprehensive guide with all features and usage
- **CHANGELOG.md**: Detailed v1.1.0 changelog following Keep a Changelog format
- **Extension Docs**: Installation, usage, and troubleshooting guides

### Files Modified
- `ide-extension/package.json` - Version updated to 1.1.0
- `ide-extension/src/extension.ts` - Added incident tracking, notifications, goToError command
- `ide-extension/src/views/incidentsTree.ts` - Redesigned with expandable cards and stack trace parsing
- `ide-extension/README.md` - Comprehensive documentation
- `ide-extension/CHANGELOG.md` - Detailed changelog
- `webapp/backend/src/routes/oauth.ts` - Enhanced IDE auth page and bug fixes
- `webapp/frontend/public/versions.json` - Added v1.1.0 entry
- `webapp/frontend/package.json` - Version updated to 1.1.0
- `webapp/backend/package.json` - Version updated to 1.1.0

---

## [1.0.3] - 2026-02-06

### 🔒 Production Hardening & Deployment Fixes

This patch release addresses critical production deployment issues discovered during the initial EC2 and Vercel deployment, ensuring reliable cross-domain authentication and session management.

### Fixed

#### Cross-Site Authentication
- **Cookie Configuration**: Updated session cookies to use `SameSite=None` in production for cross-domain requests (Vercel frontend → EC2 backend)
- **Secure Cookie Support**: Added `trust proxy` configuration for proper HTTPS detection behind reverse proxies
- **Session Persistence**: Implemented explicit `req.session.save()` in OAuth callback to prevent race conditions during redirect

#### Backend Architecture
- **Route Separation**: Split OAuth routes into dedicated `oauth.ts` file to eliminate route overlap
- **Clean Mounting**: Separated `/auth` (OAuth) and `/api` (User API) route mounting to prevent conflicts
- **Import Organization**: Added proper import structure for new OAuth routes module

#### Security Improvements
- **Token Exposure**: Removed `githubAccessToken` from `/api/me` response to prevent sensitive data leakage
- **Debug Logging**: Added comprehensive request logging middleware for production debugging
- **Integrated Documentation**: Added comprehensive documentation site for the project.



### Technical Details

#### Session Configuration
```typescript
cookie: {
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production'
}
```

#### Route Structure
- `src/routes/oauth.ts` - GitHub OAuth flow (`/auth/github`, `/auth/github/callback`)
- `src/routes/auth.ts` - User API endpoints (`/api/me`, `/api/logout`)

#### Files Modified
- `webapp/backend/src/index.ts` - Cookie config, proxy trust, debug middleware
- `webapp/backend/src/routes/oauth.ts` - New file for OAuth routes
- `webapp/backend/src/routes/auth.ts` - Removed OAuth routes, added token stripping

### Deployment Notes
- Requires backend restart after deployment
- Frontend redeploy recommended for consistency
- Users must re-authenticate after update

---

## [1.0.2] - 2026-02-06

### 🚀 Phase 2 - Production-Ready Error Ingestion

This release hardens the error ingestion system with strict validation, enhanced data capture, and adds a new API for reading incidents.

### Added

#### Hardened Ingest Endpoint
- **Renamed endpoint**: `POST /api/ingest` (was `/api/ingest/error`)
- **Structured payload format** with `error` and `context` objects
- **Strict validation** for all required fields
- **Commit SHA validation**: Enforces 40-character lowercase hex Git SHAs (`^[a-f0-9]{40}$`)
- **Environment validation**: Only accepts "production" or "preview"
- **ISO 8601 timestamp validation** for `occurred_at`
- **Enhanced error responses** with specific error codes and messages
- **201 Created** status code for successful ingestion

#### New Database Fields
- `stack_trace`: Full error stack trace (raw string)
- `error_type`: Error classification (e.g., "TypeError", "ReferenceError")
- `commit_sha`: Git commit SHA where error occurred (required, validated)
- `environment`: Deployment environment ("production" or "preview")
- `occurred_at`: Actual timestamp when error occurred (ISO 8601)
- Removed deprecated `file_path` and `line_number` fields

#### Incidents Read API
- **New endpoint**: `GET /api/incidents`
- **GitHub OAuth authentication** (JWT-based, same as dashboard)
- **Query parameters**: `repo` (required), `status`, `limit`, `offset`
- **Project ownership verification**: Only returns incidents for user's projects
- **Filtering**: By status ("open" or "resolved")
- **Pagination**: Configurable limit (1-100, default 50) and offset
- **Ordered by** `occurred_at` DESC (newest first)
- **Comprehensive error handling**: 401, 404, 400 responses

### Changed
- Ingest endpoint now requires structured payload instead of flat fields
- API key verification improved with proper hash comparison loop
- Database schema updated with new incident fields

### Technical Details
- **Migration**: `20260206002416_phase2_harden_ingest_final`
- **Validation regex**: `/^[a-f0-9]{40}$/` for commit SHAs
- **Response format**: Standardized error objects with `code` and `message`
- **Authentication**: Dual authentication (API keys for ingest, JWT for incidents)

### Documentation
- Added `docs/postman-testing.md` with curl examples
- Added `docs/phase2-migration.md` with upgrade guide
- Added `docs/phase2-validation-checklist.md`
- Added `docs/incidents-api-testing.md`
- Added `docs/test-invalid-commit-sha.md`

---

## [1.0.1] - 2026-02-06

### 🎉 Initial Release - Web App Foundation

The first release of Rootly establishes the core web application infrastructure with authentication, project management, and a premium user interface.

### Added

#### Authentication & User Management
- GitHub OAuth integration for secure authentication
- Session management with PostgreSQL storage
- User profile with GitHub data sync
- Secure logout functionality with session cleanup

#### Project Management
- Create new projects linked to GitHub repositories
- View all projects in a unified dashboard
- Delete projects with confirmation modal (requires typing repo name)
- Project ownership verification and access control

#### API Key System
- Generate secure API keys for each project
- One-time display of API keys for security
- Cryptographically secure key generation
- API key storage with project association

#### User Interface
- Modern, premium dark-themed design
- Responsive layout for all screen sizes
- Animated particle background on landing page
- Smooth transitions and hover effects
- User dropdown menu in navbar
- Project cards with visual indicators

#### Developer Experience
- Comprehensive README with setup instructions
- Architecture diagrams (Mermaid)
- Database schema documentation
- API documentation
- MIT License

#### Version System
- Version history tracking in JSON format
- Interactive version modal with implemented/planned sections
- Separate scrollable sections for versions and upcoming features
- Clickable version items showing detailed information

### Technical Details

#### Frontend
- Next.js 15 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Custom React components
- Client-side state management

#### Backend
- Node.js with Express.js
- TypeScript
- Prisma 6 ORM
- Passport.js for authentication
- PostgreSQL database via Supabase

#### Database Schema
- Users table with GitHub integration
- Projects table with repository linking
- API keys table with secure storage
- Session table for authentication

### Security
- Environment variable configuration
- Secure session management
- API key encryption
- CORS configuration
- Authentication middleware

---

## [Unreleased]

### Planned for v0.2.0 - Node.js SDK
- Error capture and serialization
- Stack trace parsing with source maps
- Context collection (user data, environment)
- Automatic error reporting
- API integration for error submission
- Zero-overhead performance monitoring

### Planned for v0.3.0 - VS Code Extension
- Real-time error notifications in IDE
- Inline error display at code locations
- Jump to error functionality
- GitHub repository synchronization
- Error filtering and search
- WebSocket integration for live updates

### Planned for v0.4.0 - Error Dashboard
- Real-time error monitoring
- Error analytics and visualization
- Error grouping and deduplication
- Source code viewer with syntax highlighting
- Team collaboration features
- Error assignment and tracking
- Comment system for errors
- Resolution workflow

---



## Version History

- **[1.1.0]** - 2026-02-08 - IDE Extension Release
- **[1.0.3]** - 2026-02-06 - Production Hardening & Deployment Fixes
- **[1.0.2]** - 2026-02-06 - Phase 2 (Production-Ready Error Ingestion)
- **[1.0.1]** - 2026-02-06 - Initial release (Web App Foundation)

---

## Contributing

See [README.md](README.md) for contribution guidelines.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
