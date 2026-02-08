# Changelog

All notable changes to the Rootly VS Code extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-02-08

### Added
- **Go to Error Location**: One-click navigation to exact file and line where errors occurred
- **Stack Trace Parsing**: Automatic detection of error locations from stack traces
  - Supports TypeScript, JavaScript, Python, Java, Go, Ruby, and PHP
- **Expandable Incident Cards**: Click incidents to see detailed information
  - Environment badges
  - Timestamps with "time ago" formatting
  - Commit SHA display
- **New Incident Notifications**: Desktop alerts when new incidents are detected
  - "View Incidents" action to focus sidebar
  - Only alerts for newly detected incidents
- **Manual Refresh**: Rate-limited refresh button in toolbar
  - 5 refreshes per 2-minute window
  - Prevents API abuse
- **Toolbar Actions**: Quick access buttons in sidebar header
  - Refresh (🔄)
  - Disconnect (🔌)
  - Logout (👤)

### Changed
- **Redesigned Sidebar UI**: Professional, clean interface
  - Removed emoji-based icons
  - Added VS Code native icons
  - Better visual hierarchy
- **Improved Incident Details Panel**: Minimal, professional design
  - Highlighted "Jump to Error" section
  - Clear action descriptions
  - Better organized information sections
- **Enhanced OAuth Flow**: Minimal, professional authentication page
  - Matches webapp theme
  - Cleaner token display
  - Better user instructions

### Fixed
- **OAuth Callback Error**: Fixed "headers already sent" error in IDE authentication flow
- **Session Cookie Handling**: Improved cookie signing and transmission
- **Incident Data Flow**: Fixed incidents not displaying correctly in sidebar
- **Persistent Notifications**: Removed auto-shown refresh messages that never disappeared

### Technical
- Added `rootly.goToError` command for navigation
- Implemented incident tracking with `previousIncidentIds` Set
- Stack trace regex pattern: `/(?:at\s+|\()([^\s()]+\.(ts|js|tsx|jsx|py|java|go|rb|php)):(\d+)(?::(\d+))?/`
- Workspace file search with `**/node_modules/**` exclusion
- VS Code theme-aware styling using CSS variables

## [0.1.0] - 2026-02-06

### Added
- Initial release
- GitHub OAuth authentication
- Repository connection and verification
- Basic incident viewing in sidebar
- Real-time incident polling (45-second interval)
- Incident details panel
- Login/Logout functionality
- Connect/Disconnect repository

### Technical
- Express backend with Prisma ORM
- PostgreSQL session store
- Next.js frontend
- VS Code Extension API integration

---

## Upgrade Guide

### From 0.1.0 to 1.1.0

No breaking changes. Simply update the extension and restart VS Code. All existing functionality remains the same with additional features added.

**New Features to Try:**
1. Click any incident to expand and see "Go to Error Location"
2. Use the toolbar refresh button for manual updates
3. Watch for desktop notifications when new incidents arrive
4. Click "View Full Details" to see the improved incident panel

---

[1.1.0]: https://github.com/yourusername/rootly/compare/v0.1.0...v1.1.0
[0.1.0]: https://github.com/yourusername/rootly/releases/tag/v0.1.0
