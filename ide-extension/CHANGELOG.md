# Changelog

All notable changes to the Rootly VS Code extension are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## [1.1.3] - 2026-02-15

### Fixed
- **Path Resolution**: "Go to Error" now correctly handles absolute paths from the same machine (no more "File not found" for local setups)
- **Fuzzy Matching**: Improved workspace file search to correctly find files even if they are in `node_modules` when the path suggests it
- **Code Duplication**: Refactored navigation logic to be consistent between command palette and sidebar clicks

## [1.1.2] - 2026-02-10

### Fixed
- File path resolution now correctly extracts filename from absolute Windows paths
- "Go to Error Location" button now works when workspace is opened at any level
- Fixed issue where extension could not find files that exist in workspace

## [1.1.1] - 2026-02-10

### Fixed
- Stack trace parsing now correctly handles Windows file paths containing spaces
- Updated regex pattern to parse paths such as `z:\Work Files\Projects\...`
- File locations now display in incident list descriptions (format: `filename.js:line`)
- "Go to Error Location" button now appears correctly when expanding incidents

## [1.1.0] - 2026-02-08

### Added
- Error location navigation with one-click file opening at specific line numbers
- Automatic stack trace parsing for TypeScript, JavaScript, Python, Java, Go, Ruby, and PHP
- Expandable incident cards in sidebar with detailed information on expansion
- Environment badges displaying production, staging, or development context
- Relative timestamp display with "time ago" formatting
- Commit SHA display for version control correlation
- Desktop notifications for newly detected incidents with "View Incidents" action
- Rate-limited manual refresh button (5 requests per 2-minute window)
- Toolbar action buttons for refresh, disconnect, and logout operations

### Changed
- Redesigned sidebar interface with professional styling and native VS Code icons
- Improved incident details panel with minimal, focused design
- Enhanced OAuth authentication page with cleaner token display
- Removed emoji-based icons in favor of VS Code theme icons

### Fixed
- OAuth callback error where headers were sent multiple times
- Session cookie handling and signing mechanism
- Incident data flow ensuring correct display in sidebar
- Persistent notification messages that did not auto-dismiss

### Technical
- Implemented `rootly.goToError` command for error navigation
- Added incident tracking using `previousIncidentIds` Set for notification deduplication
- Stack trace regex pattern: `/(?:at\s+|\()([^\s()]+\.(ts|js|tsx|jsx|py|java|go|rb|php)):(\d+)(?::(\d+))?/`
- Workspace file search with `**/node_modules/**` exclusion pattern
- VS Code theme-aware styling using CSS custom properties

## [0.1.0] - 2026-02-06

### Added
- Initial extension release
- GitHub OAuth authentication flow
- Repository connection and verification
- Basic incident viewing in sidebar tree view
- Real-time incident polling with 45-second interval
- Incident details panel display
- Login and logout functionality
- Repository connection and disconnection commands

### Technical
- Express backend server with Prisma ORM integration
- PostgreSQL session store for authentication persistence
- Next.js frontend for OAuth callback handling
- VS Code Extension API integration for sidebar and commands

## Upgrade Notes

### From 0.1.0 to 1.1.0
No breaking changes. Update the extension and restart VS Code. All existing functionality remains unchanged with additional features available.

New functionality includes expandable incident cards, error location navigation, desktop notifications, and manual refresh controls.

### From 1.1.0 to 1.1.1
No breaking changes. This release fixes stack trace parsing for Windows file paths containing spaces. No configuration changes required.

[1.1.1]: https://github.com/Lancerhawk/Project-Rootly/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/Lancerhawk/Project-Rootly/compare/v0.1.0...v1.1.0
[0.1.0]: https://github.com/Lancerhawk/Project-Rootly/releases/tag/v0.1.0
