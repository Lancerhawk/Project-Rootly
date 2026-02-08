# Rootly - Production Error Tracking for VS Code

Debug production errors directly in your IDE. Rootly surfaces runtime failures exactly where they happened in your code—no more context switching between dashboards and editors.

## Features

### 🔍 Real-Time Error Tracking
- Production incidents appear directly in your VS Code sidebar
- Automatic polling every 45 seconds for new errors
- Desktop notifications when new incidents are detected

### 🎯 Jump to Error Location
- One-click navigation to the exact file and line where errors occurred
- Automatic stack trace parsing for TypeScript, JavaScript, Python, Java, Go, Ruby, and PHP
- Opens files directly in your workspace

### 📊 Expandable Incident Cards
- Click any incident to see detailed information
- Environment badges (Production, Staging, Development)
- Timestamps with "time ago" formatting
- Commit SHA for easy Git correlation

### 🔄 Manual Refresh
- Rate-limited refresh button (5 refreshes per 2 minutes)
- Toolbar buttons for quick actions
- Clean, professional UI

### 🔐 Secure Authentication
- GitHub OAuth integration
- Session-based authentication
- Repository verification

## Installation

1. Install the extension from VS Code Marketplace (coming soon) or from `.vsix` file
2. Click "Login with GitHub" in the Rootly sidebar
3. Authenticate and copy the session token
4. Paste the token back into VS Code
5. Connect your GitHub repository
6. Start seeing production errors in your IDE!

## Usage

### Viewing Incidents
1. Open the Rootly sidebar (Activity Bar icon)
2. See all open incidents for your connected repository
3. Click any incident to expand and see details

### Navigating to Errors
- **From Sidebar**: Expand incident → Click "Go to Error Location"
- **From Details Panel**: Click "View Full Details" → Click "Jump to Error"

### Manual Refresh
- Click the refresh icon (🔄) in the sidebar toolbar
- Limited to 5 refreshes per 2-minute window to prevent API abuse

### Managing Connection
- **Disconnect**: Click disconnect icon (🔌) to unlink repository
- **Logout**: Click logout icon (👤) to clear session

## Requirements

- VS Code 1.85.0 or higher
- Active Rootly account with connected repository
- GitHub repository access

## Extension Settings

This extension contributes the following commands:

- `rootly.login`: Authenticate with GitHub
- `rootly.logout`: Clear session and logout
- `rootly.connectRepo`: Connect a GitHub repository
- `rootly.disconnectRepo`: Disconnect current repository
- `rootly.refresh`: Manually refresh incidents
- `rootly.goToError`: Navigate to error location
- `rootly.showIncidentDetails`: Open incident details panel

## Known Issues

- Stack trace parsing currently supports common file patterns only
- Files must exist in your local workspace to navigate to errors
- Polling interval is fixed at 45 seconds (not configurable yet)

## Release Notes

### 1.1.0 (Latest)

**Major UI/UX Improvements**
- ✨ Added "Go to Error Location" button with automatic stack trace parsing
- 🎨 Redesigned sidebar with expandable incident cards
- 📱 New incident notifications with "View Incidents" action
- 🎯 Professional incident details panel with highlighted actions
- 🔄 Rate-limited manual refresh (5 per 2 minutes)
- 🎨 Clean, professional icons throughout (removed emoji-based icons)

**Backend Improvements**
- 🔐 Fixed IDE OAuth flow with minimal, professional auth page
- 🍪 Improved session cookie handling and signing
- 🐛 Fixed "headers already sent" error in OAuth callback

**Technical**
- Stack trace regex supports: TS, JS, Python, Java, Go, Ruby, PHP
- VS Code theme-aware styling
- Workspace file search with node_modules exclusion

### 0.1.0

- Initial release
- Basic incident viewing
- GitHub OAuth authentication
- Repository connection

## Contributing

This extension is part of the Rootly project. For issues and feature requests, please visit our [GitHub repository](https://github.com/yourusername/rootly).

## License

[Your License Here]

---

**Enjoy debugging with Rootly!** 🚀
