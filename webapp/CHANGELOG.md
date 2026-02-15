# Changelog

All notable changes to the Rootly web application are documented in this file.

## [1.2.5] - 2026-02-15
### IDE Extension (v1.1.4)
- **Multi-File Stack Traces**: Added support for parsing and navigating all file locations in a stack trace, not just the first one.
- **Improved UI**: Cleaned up file path display in incident lists and details view to show `filename:line` format.
- **Platform Support**: Fixed path parsing for Windows file paths in stack traces.

## [1.2.4] - 2026-02-15

### IDE Extension Updates
- **Path Resolution Fix**: "Go to Error Location" now supports absolute paths from local environments.
- **Fuzzy Matching**: Enhanced workspace file search to locate files even when inside `node_modules` if inferred from the path.
- **Unified Navigation**: Clicking an incident in the sidebar or command palette now uses the same consistent logic to locate files.

## [1.2.3] - 2026-02-14

### SDK Updates
- Published rootly-runtime v1.2.8 with externalized API configuration
- Security hardening to prevent source code leaks
- Build time environment injection via .env

## [1.2.2] - 2026-02-10

### SDK Updates
- Published rootly-runtime v1.2.6 with Express error handling fix
- Published rootly-runtime v1.2.5 with commit SHA fallback mechanism

### IDE Extension Updates
- Published VS Code extension v1.1.2 with file path resolution fix
- Published VS Code extension v1.1.1 with Windows path parsing fix

### Fixed
- SDK Express middleware now correctly detects 5xx errors by checking err.status, err.statusCode, or res.statusCode
- SDK provides fallback commit SHA when environment variables are unavailable
- IDE extension file navigation now works at any workspace level
- IDE extension stack trace parsing handles Windows paths with spaces

## [1.2.1] - 2026-02-09

### Added
- Serverless environment support with flush() method
- Promise-based SDK API for async/await usage
- Full support for Railway, Render, and GitHub Actions deployments

### Changed
- SDK transport layer now uses Promises
- Active request tracking with Set for proper cleanup

### Known Limitations
- Vercel serverless functions currently support manual capture only
- Automatic error capture for Vercel coming in v1.3.0

## [1.2.0] - 2026-02-09

### Added
- Severity support for error/warning/info levels
- Environment normalization with NODE_ENV fallback
- Debug mode with optional stderr logging
- Recursive capture protection using Symbol flags

### Changed
- Improved fingerprinting algorithm with normalized whitespace
- Optimized rate limiter with O(n) performance
- Hard memory cap of 500 fingerprints with auto-cleanup

### Fixed
- Environment fallback now uses NODE_ENV correctly
- Removed dangerous listener guards
- Fixed transport decrement bug
- Nullish coalescing for severity parameter

## [1.1.0] - 2026-02-08

### Added
- VS Code extension with Go to Error Location functionality
- Expandable incident cards in IDE sidebar
- Desktop notifications for new incidents
- Rate-limited manual refresh (5 per 2 minutes)
- Professional UI redesign with native VS Code icons

### Fixed
- OAuth callback "headers already sent" error
- Session cookie handling and signing
- Incident data flow in sidebar display

## [1.0.3] - 2026-02-06

### Added
- Cross-site cookie support with SameSite=None
- Proxy trust configuration for secure cookies
- Debug logging middleware

### Fixed
- Session race condition in OAuth flow
- Route architecture conflicts between OAuth and API endpoints
- Token exposure in API responses

## [1.0.2] - 2026-02-06

### Added
- Hardened ingest endpoint with strict validation
- Incidents read API with JWT authentication
- Commit SHA validation (40-character hex)
- Comprehensive API documentation

### Changed
- Enhanced data capture with stack traces and error types
- Migration: phase2_harden_ingest_final

## [1.0.1] - 2026-02-06

### Added
- GitHub OAuth integration
- Project management interface
- Premium dashboard UI with dark theme
- User authentication and session management

### Technical
- Next.js 15 frontend
- Express backend with Prisma 6
- Supabase PostgreSQL database
