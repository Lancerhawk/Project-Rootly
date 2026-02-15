# Rootly VS Code Extension

Production error tracking integrated directly into Visual Studio Code. This extension displays runtime errors from deployed applications within the IDE, enabling developers to navigate to error locations without switching between external dashboards and code editors.

## Features

### Real-Time Error Monitoring
Production incidents are displayed in the VS Code sidebar with automatic polling at 45-second intervals. Desktop notifications alert developers when new incidents are detected.

### Error Location Navigation
The extension parses stack traces to extract file paths and line numbers, providing one-click navigation to error locations. Supported languages include TypeScript, JavaScript, Python, Java, Go, Ruby, and PHP. Files must exist in the local workspace for navigation to function.

### Incident Details
### Incident Details
Incidents can be expanded to view detailed information including environment context, occurrence timestamps, and commit SHA. **Stack traces are fully parsed**, allowing you to see the entire chain of failure with clickable links to every file location involved.

### Manual Refresh
A rate-limited refresh control is available in the sidebar toolbar, restricted to 5 requests per 2-minute window to prevent excessive API usage.

### Authentication
GitHub OAuth integration provides secure authentication with session-based credential management and repository verification.

## Installation

1. Install the extension from the VS Code Marketplace or from a `.vsix` package file
2. Open the Rootly sidebar from the Activity Bar
3. Select "Login with GitHub" and complete the OAuth flow
4. Copy the generated session token
5. Paste the token into the VS Code prompt
6. Connect the target GitHub repository

## Usage

### Viewing Incidents
Open the Rootly sidebar to view all open incidents for the connected repository. Click any incident to expand and view detailed information.

### Navigating to Error Locations
From the sidebar, expand an incident and select "Go to Error Location". Alternatively, open the incident details panel and select "Jump to Error".

### Refreshing Incidents
Use the refresh button in the sidebar toolbar to manually fetch the latest incidents. This action is rate-limited to prevent API abuse.

### Managing Connections
Use the disconnect button to unlink the current repository or the logout button to clear the authentication session.

## Requirements

- Visual Studio Code version 1.85.0 or higher
- Active Rootly account with repository integration
- GitHub repository access permissions

## Commands

The extension provides the following commands accessible via the Command Palette:

- `rootly.login` - Initiate GitHub OAuth authentication
- `rootly.logout` - Clear session and terminate authentication
- `rootly.connectRepo` - Link a GitHub repository
- `rootly.disconnectRepo` - Unlink the current repository
- `rootly.refresh` - Manually refresh incident list
- `rootly.goToError` - Navigate to error location in code
- `rootly.showIncidentDetails` - Display incident details panel

## Known Limitations

- Stack trace parsing supports common file path patterns only
- Error navigation requires files to exist in the local workspace
- Polling interval is fixed at 45 seconds and not user-configurable
- Windows file paths with spaces require extension version 1.1.1 or higher

## Release History

### Version 1.1.1
Fixed stack trace parsing for Windows file paths containing spaces. File locations now display correctly in the incident list and the "Go to Error Location" button functions as expected.

### Version 1.1.0
Added error location navigation with automatic stack trace parsing. Redesigned sidebar interface with expandable incident cards. Implemented desktop notifications for new incidents. Added rate-limited manual refresh control. Fixed OAuth callback issues and improved session management.

### Version 0.1.0
Initial release with basic incident viewing, GitHub OAuth authentication, and repository connection functionality.

## Support

For issues and feature requests, visit the project repository at https://github.com/Lancerhawk/Project-Rootly

## License

MIT License
