import * as vscode from 'vscode';
import { login, logout, getToken, isAuthenticated } from './auth';
import { detectRepo } from './repoDetection';
import { IncidentPoller } from './poller';
import { IncidentsTreeProvider } from './views/incidentsTree';
import { ExtensionState } from './state';
import { verifyProject, getUsernameFromSession, Incident } from './api';

let poller: IncidentPoller | null = null;
let extensionState: ExtensionState | null = null;
let treeProvider: IncidentsTreeProvider | null = null;

// Rate limiting for manual refresh
const REFRESH_LIMIT = 5;
const REFRESH_WINDOW_MS = 2 * 60 * 1000; // 2 minutes
const refreshTimestamps: number[] = [];

// Store current incidents
let currentIncidents: Incident[] = [];
let previousIncidentIds: Set<string> = new Set();

export function activate(context: vscode.ExtensionContext) {
    console.log('Rootly extension activated');

    // Initialize state management
    extensionState = new ExtensionState(context);

    // Create tree view provider
    treeProvider = new IncidentsTreeProvider();

    // Register tree view
    vscode.window.registerTreeDataProvider('rootly.incidents', treeProvider);

    // Create poller
    poller = new IncidentPoller(context, (incidents: Incident[]) => {
        // Check for new incidents
        const newIncidents = incidents.filter(inc => !previousIncidentIds.has(inc.incident_id));

        // Store incidents and update tree view
        currentIncidents = incidents;

        // Show notification for new incidents
        if (newIncidents.length > 0 && previousIncidentIds.size > 0) {
            const message = newIncidents.length === 1
                ? `New incident: ${newIncidents[0].summary}`
                : `${newIncidents.length} new incidents detected`;

            vscode.window.showErrorMessage(message, 'View Incidents').then(selection => {
                if (selection === 'View Incidents') {
                    vscode.commands.executeCommand('rootly.incidents.focus');
                }
            });
        }

        // Update previous incident IDs
        previousIncidentIds = new Set(incidents.map(inc => inc.incident_id));

        updateTreeView();
    });

    // Register commands
    context.subscriptions.push(
        vscode.commands.registerCommand('rootly.login', async () => {
            await handleLogin();
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('rootly.logout', async () => {
            await handleLogout();
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('rootly.connectRepo', async () => {
            await handleConnectRepo();
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('rootly.disconnectRepo', async () => {
            await handleDisconnectRepo();
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('rootly.refresh', async () => {
            await handleRefresh();
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('rootly.showIncidentDetails', (incident: Incident) => {
            showIncidentDetails(incident);
        })
    );

    // Register Go to Error command
    context.subscriptions.push(
        vscode.commands.registerCommand('rootly.goToError', async (filePath: string, line: number) => {
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (workspaceFolders && workspaceFolders.length > 0) {
                // Extract just the filename from the full path (handles both Unix and Windows paths)
                const fileName = filePath.split('/').pop() || filePath.split('\\').pop() || filePath;

                const files = await vscode.workspace.findFiles(`**/${fileName}`, '**/node_modules/**', 1);
                if (files.length > 0) {
                    const document = await vscode.workspace.openTextDocument(files[0]);
                    const editor = await vscode.window.showTextDocument(document);

                    // Jump to the line
                    const lineIndex = Math.max(0, line - 1); // Convert to 0-based
                    const position = new vscode.Position(lineIndex, 0);
                    editor.selection = new vscode.Selection(position, position);
                    editor.revealRange(new vscode.Range(position, position), vscode.TextEditorRevealType.InCenter);
                } else {
                    vscode.window.showWarningMessage(`File not found in workspace: ${fileName}`);
                }
            } else {
                vscode.window.showWarningMessage('No workspace folder open');
            }
        })
    );

    // Initialize tree view on startup
    initializeTreeView();
}

export function deactivate() {
    poller?.stop();
}

/**
 * Initialize tree view on extension startup
 */
async function initializeTreeView() {
    if (!extensionState || !treeProvider) {
        return;
    }

    const authenticated = await isAuthenticated(extensionState['context']);
    const connectedRepo = extensionState.getConnectedRepo();
    const username = extensionState.getUsername();

    if (authenticated && connectedRepo) {
        // Resume polling if user was previously connected
        poller?.start(connectedRepo);
    }

    updateTreeView();
}

/**
 * Handle login command
 */
async function handleLogin() {
    if (!extensionState) {
        return;
    }

    const sessionId = await login(extensionState['context']);

    if (sessionId) {
        // Extract username from session
        const username = await getUsernameFromSession(sessionId);
        if (username) {
            await extensionState.setUsername(username);
        }

        vscode.window.showInformationMessage('Successfully logged in to Rootly');
        updateTreeView();
    }
}

/**
 * Handle logout command
 */
async function handleLogout() {
    if (!extensionState) {
        return;
    }

    await logout(extensionState['context']);
    await extensionState.clearAll();
    poller?.stop();

    vscode.window.showInformationMessage('Logged out of Rootly');
    updateTreeView();
}

/**
 * Handle connect repository command
 */
async function handleConnectRepo() {
    if (!extensionState) {
        return;
    }

    // Check if authenticated
    const authenticated = await isAuthenticated(extensionState['context']);
    if (!authenticated) {
        vscode.window.showWarningMessage('Please login first');
        return;
    }

    // Detect Git repository
    const repo = detectRepo();
    if (!repo) {
        vscode.window.showErrorMessage(
            'No Git repository detected in the current workspace. Please open a folder with a .git directory.',
            'Learn More'
        ).then(selection => {
            if (selection === 'Learn More') {
                vscode.env.openExternal(vscode.Uri.parse('https://git-scm.com/book/en/v2/Git-Basics-Getting-a-Git-Repository'));
            }
        });
        return;
    }

    // Get session ID
    const sessionId = await getToken(extensionState['context']);
    if (!sessionId) {
        vscode.window.showWarningMessage('Please login first');
        return;
    }

    // Show progress
    await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: `Verifying ${repo}...`,
        cancellable: false
    }, async (progress) => {
        // Verify project exists in backend
        const isVerified = await verifyProject(repo, sessionId);

        if (!isVerified) {
            vscode.window.showErrorMessage(
                `Repository "${repo}" is not registered in Rootly. Please create a project for this repository in the dashboard first.`,
                'Open Dashboard'
            ).then(selection => {
                if (selection === 'Open Dashboard') {
                    // vscode.env.openExternal(vscode.Uri.parse('http://localhost:3000'));
                    vscode.env.openExternal(vscode.Uri.parse('https://project-rootly.vercel.app'));
                }
            });
            return;
        }

        // Save connected repo
        await extensionState!.setConnectedRepo(repo);

        // Start polling
        poller?.start(repo);

        vscode.window.showInformationMessage(`Connected to ${repo}`);
        updateTreeView();
    });
}

/**
 * Handle disconnect repository command
 */
async function handleDisconnectRepo() {
    if (!extensionState) {
        return;
    }

    await extensionState.setConnectedRepo(null);
    poller?.stop();

    vscode.window.showInformationMessage('Disconnected from repository');
    updateTreeView();
}

/**
 * Handle manual refresh with rate limiting
 */
async function handleRefresh() {
    const now = Date.now();

    // Remove timestamps older than the window
    while (refreshTimestamps.length > 0 && refreshTimestamps[0] < now - REFRESH_WINDOW_MS) {
        refreshTimestamps.shift();
    }

    // Check if limit exceeded
    if (refreshTimestamps.length >= REFRESH_LIMIT) {
        const oldestTimestamp = refreshTimestamps[0];
        const waitTime = Math.ceil((oldestTimestamp + REFRESH_WINDOW_MS - now) / 1000);
        vscode.window.showWarningMessage(
            `⏱️ Refresh limit reached. Please wait ${waitTime} seconds before refreshing again.`
        );
        return;
    }

    // Add current timestamp
    refreshTimestamps.push(now);

    // Trigger refresh
    await poller?.refresh();
    // Note: Success feedback shown via Output channel
    updateTreeView();
}

/**
 * Update tree view with current state
 */
function updateTreeView() {
    if (!extensionState || !treeProvider) {
        return;
    }

    isAuthenticated(extensionState['context']).then(authenticated => {
        const connectedRepo = extensionState!.getConnectedRepo();
        const username = extensionState!.getUsername();

        // Get incidents from storage
        const incidents = currentIncidents;

        treeProvider!.updateState(authenticated, connectedRepo, username, incidents);
    });
}

/**
 * Show incident details in a webview panel
 */
function showIncidentDetails(incident: Incident) {
    const panel = vscode.window.createWebviewPanel(
        'incidentDetails',
        `Incident: ${incident.summary}`,
        vscode.ViewColumn.One,
        {
            enableScripts: true
        }
    );

    // Parse stack trace to find first file location
    const stackLines = incident.stack_trace ? incident.stack_trace.split('\n') : [];
    let firstFileLocation: { file: string; line: number } | null = null;

    for (const line of stackLines) {
        // Match patterns like: at file.ts:42:10 or (file.ts:42:10)
        const match = line.match(/(?:at\s+|\()([^\s()]+\.(ts|js|tsx|jsx|py|java|go|rb|php)):(\d+)(?::(\d+))?/);
        if (match) {
            firstFileLocation = {
                file: match[1],
                line: parseInt(match[3], 10)
            };
            break;
        }
    }

    panel.webview.html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: var(--vscode-font-family);
                    padding: 20px;
                    color: var(--vscode-foreground);
                    line-height: 1.6;
                }
                .header {
                    margin-bottom: 24px;
                }
                .title {
                    font-size: 18px;
                    font-weight: 600;
                    margin-bottom: 12px;
                }
                .meta {
                    display: flex;
                    gap: 16px;
                    flex-wrap: wrap;
                    margin-bottom: 8px;
                    font-size: 13px;
                    color: var(--vscode-descriptionForeground);
                }
                .meta-item {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                .badge {
                    background: var(--vscode-badge-background);
                    color: var(--vscode-badge-foreground);
                    padding: 2px 8px;
                    border-radius: 3px;
                    font-size: 11px;
                    font-weight: 500;
                }
                .action-section {
                    margin-bottom: 24px;
                    padding: 16px;
                    background: var(--vscode-editor-inactiveSelectionBackground);
                    border-radius: 6px;
                    border-left: 3px solid var(--vscode-button-background);
                }
                .action-title {
                    font-size: 13px;
                    font-weight: 600;
                    margin-bottom: 8px;
                    color: var(--vscode-foreground);
                }
                .action-desc {
                    font-size: 12px;
                    color: var(--vscode-descriptionForeground);
                    margin-bottom: 12px;
                }
                .button {
                    background: var(--vscode-button-background);
                    color: var(--vscode-button-foreground);
                    border: none;
                    padding: 8px 14px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 13px;
                    font-weight: 500;
                    transition: background 0.1s;
                }
                .button:hover {
                    background: var(--vscode-button-hoverBackground);
                }
                .button:active {
                    opacity: 0.9;
                }
                .section {
                    margin-bottom: 20px;
                }
                .section-title {
                    font-weight: 600;
                    font-size: 13px;
                    margin-bottom: 8px;
                    color: var(--vscode-foreground);
                }
                .stack-trace {
                    background: var(--vscode-textCodeBlock-background);
                    padding: 12px;
                    border-radius: 4px;
                    font-family: 'Courier New', monospace;
                    font-size: 12px;
                    overflow-x: auto;
                    white-space: pre-wrap;
                    border: 1px solid var(--vscode-panel-border);
                }
                .info-box {
                    background: var(--vscode-textCodeBlock-background);
                    padding: 8px 12px;
                    border-radius: 4px;
                    font-size: 12px;
                    font-family: monospace;
                    border: 1px solid var(--vscode-panel-border);
                }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="title">${incident.summary}</div>
                <div class="meta">
                    <div class="meta-item">
                        <span class="badge">${incident.environment.toUpperCase()}</span>
                    </div>
                    <div class="meta-item">
                        <span>🕐 ${new Date(incident.occurred_at).toLocaleString()}</span>
                    </div>
                    <div class="meta-item">
                        <span>📝 ${incident.commit_sha.substring(0, 7)}</span>
                    </div>
                </div>
            </div>

            ${firstFileLocation ? `
            <div class="action-section">
                <div class="action-title">Jump to Error</div>
                <div class="action-desc">Open the file where this error occurred</div>
                <button class="button" onclick="goToError()">
                    → Open ${firstFileLocation.file}:${firstFileLocation.line}
                </button>
            </div>
            ` : ''}

            ${incident.error_type ? `
            <div class="section">
                <div class="section-title">Error Type</div>
                <div class="info-box">${incident.error_type}</div>
            </div>
            ` : ''}

            <div class="section">
                <div class="section-title">Stack Trace</div>
                <div class="stack-trace">${incident.stack_trace || 'No stack trace available'}</div>
            </div>

            <div class="section">
                <div class="section-title">Incident ID</div>
                <div class="info-box">${incident.incident_id}</div>
            </div>

            <script>
                const vscode = acquireVsCodeApi();
                
                function goToError() {
                    vscode.postMessage({
                        command: 'goToError',
                        file: '${firstFileLocation?.file || ''}',
                        line: ${firstFileLocation?.line || 0}
                    });
                }
            </script>
        </body>
        </html>
    `;

    // Handle messages from webview
    panel.webview.onDidReceiveMessage(
        async message => {
            if (message.command === 'goToError') {
                // Try to find and open the file
                const workspaceFolders = vscode.workspace.workspaceFolders;
                if (workspaceFolders && workspaceFolders.length > 0) {
                    // Extract just the filename from the full path (handles both Unix and Windows paths)
                    const fileName = message.file.split('/').pop() || message.file.split('\\').pop() || message.file;

                    const files = await vscode.workspace.findFiles(`**/${fileName}`, '**/node_modules/**', 1);
                    if (files.length > 0) {
                        const document = await vscode.workspace.openTextDocument(files[0]);
                        const editor = await vscode.window.showTextDocument(document);

                        // Jump to the line
                        const line = Math.max(0, message.line - 1); // Convert to 0-based
                        const position = new vscode.Position(line, 0);
                        editor.selection = new vscode.Selection(position, position);
                        editor.revealRange(new vscode.Range(position, position), vscode.TextEditorRevealType.InCenter);
                    } else {
                        vscode.window.showWarningMessage(`File not found in workspace: ${fileName}`);
                    }
                } else {
                    vscode.window.showWarningMessage('No workspace folder open');
                }
            }
        },
        undefined,
        []
    );
}
