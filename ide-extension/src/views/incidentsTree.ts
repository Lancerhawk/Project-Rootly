import * as vscode from 'vscode';
import { Incident } from '../api';

export class IncidentsTreeProvider implements vscode.TreeDataProvider<IncidentTreeItem> {
    private _onDidChangeTreeData = new vscode.EventEmitter<IncidentTreeItem | undefined | null | void>();
    readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

    private incidents: Incident[] = [];
    private isAuthenticated = false;
    private connectedRepo: string | null = null;
    private username: string | null = null;

    constructor() { }

    /**
     * Update tree state
     */
    updateState(authenticated: boolean, connectedRepo: string | null, username: string | null, incidents: Incident[]) {
        this.isAuthenticated = authenticated;
        this.connectedRepo = connectedRepo;
        this.username = username;
        this.incidents = incidents;
        this.refresh();
    }

    /**
     * Refresh tree view
     */
    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: IncidentTreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: IncidentTreeItem): Thenable<IncidentTreeItem[]> {
        // If element is an incident parent, show its details as children
        if (element && (element as any).isIncidentParent) {
            const incident = (element as any).incident;
            const occurredDate = new Date(incident.occurred_at);
            const timeAgo = this.getTimeAgo(occurredDate);

            const children: IncidentTreeItem[] = [];

            // Parse stack trace to find error location
            const stackLines = incident.stack_trace ? incident.stack_trace.split('\n') : [];
            let firstFileLocation: { file: string; line: number } | null = null;

            for (const line of stackLines) {
                const match = line.match(/(?:at\s+.*?\s+)?\(?([^()]+\.(ts|js|tsx|jsx|py|java|go|rb|php)):(\d+)(?::(\d+))?\)?/);
                if (match) {
                    firstFileLocation = {
                        file: match[1],
                        line: parseInt(match[3], 10)
                    };
                    break;
                }
            }

            // Add Go to Error button if we found a location
            if (firstFileLocation) {
                children.push(
                    new IncidentTreeItem(
                        'Go to Error Location',
                        `${firstFileLocation.file.split(/[/\\]/).pop()}:${firstFileLocation.line}`,
                        vscode.TreeItemCollapsibleState.None,
                        {
                            command: 'rootly.goToError',
                            title: 'Go to Error',
                            arguments: [firstFileLocation.file, firstFileLocation.line]
                        },
                        new vscode.ThemeIcon('arrow-right', new vscode.ThemeColor('charts.blue'))
                    )
                );
            }

            // Add incident details
            children.push(
                new IncidentTreeItem(
                    `Environment: ${incident.environment.toUpperCase()}`,
                    '',
                    vscode.TreeItemCollapsibleState.None,
                    undefined,
                    new vscode.ThemeIcon('server-environment')
                ),
                new IncidentTreeItem(
                    `Occurred: ${timeAgo}`,
                    new Date(incident.occurred_at).toLocaleString(),
                    vscode.TreeItemCollapsibleState.None,
                    undefined,
                    new vscode.ThemeIcon('clock')
                ),
                new IncidentTreeItem(
                    `Commit: ${incident.commit_sha.substring(0, 7)}`,
                    incident.commit_sha,
                    vscode.TreeItemCollapsibleState.None,
                    undefined,
                    new vscode.ThemeIcon('git-commit')
                ),
                new IncidentTreeItem(
                    'View Full Details',
                    'Click to open incident details panel',
                    vscode.TreeItemCollapsibleState.None,
                    {
                        command: 'rootly.showIncidentDetails',
                        title: 'Show Details',
                        arguments: [incident]
                    },
                    new vscode.ThemeIcon('file-text')
                )
            );

            return Promise.resolve(children);
        }

        if (element) {
            return Promise.resolve([]);
        }

        // State 1: Not logged in
        if (!this.isAuthenticated) {
            return Promise.resolve([
                new IncidentTreeItem(
                    'Login with GitHub',
                    'Click to authenticate',
                    vscode.TreeItemCollapsibleState.None,
                    {
                        command: 'rootly.login',
                        title: 'Login',
                        arguments: []
                    },
                    new vscode.ThemeIcon('sign-in')
                )
            ]);
        }

        // State 2: Logged in, no repo connected
        if (!this.connectedRepo) {
            const items: IncidentTreeItem[] = [
                new IncidentTreeItem(
                    `Logged in as ${this.username || 'user'}`,
                    '',
                    vscode.TreeItemCollapsibleState.None,
                    undefined,
                    new vscode.ThemeIcon('account')
                ),
                new IncidentTreeItem(
                    'Connect Git Repository',
                    '',
                    vscode.TreeItemCollapsibleState.None,
                    {
                        command: 'rootly.connectRepo',
                        title: 'Connect Repository',
                        arguments: []
                    },
                    new vscode.ThemeIcon('plug')
                ),
                new IncidentTreeItem(
                    'Logout',
                    '',
                    vscode.TreeItemCollapsibleState.None,
                    {
                        command: 'rootly.logout',
                        title: 'Logout',
                        arguments: []
                    },
                    new vscode.ThemeIcon('sign-out')
                )
            ];
            return Promise.resolve(items);
        }

        // State 3 & 4: Logged in, repo connected
        const items: IncidentTreeItem[] = [];

        // Show connected repository info (not clickable)
        items.push(
            new IncidentTreeItem(
                this.connectedRepo,
                'Connected Repository',
                vscode.TreeItemCollapsibleState.None,
                undefined,
                new vscode.ThemeIcon('repo', new vscode.ThemeColor('charts.green'))
            )
        );

        // Show incidents or "no incidents" message
        if (this.incidents.length === 0) {
            items.push(
                new IncidentTreeItem(
                    'All Clear',
                    'No open incidents',
                    vscode.TreeItemCollapsibleState.None,
                    undefined,
                    new vscode.ThemeIcon('pass', new vscode.ThemeColor('testing.iconPassed'))
                )
            );
        } else {
            // Add each incident as a collapsible card with details
            this.incidents.forEach(incident => {
                const occurredDate = new Date(incident.occurred_at);
                const timeAgo = this.getTimeAgo(occurredDate);

                // Parse stack trace to find error location for display
                const stackLines = incident.stack_trace ? incident.stack_trace.split('\n') : [];
                let fileLocationText = '';

                for (const line of stackLines) {
                    // Updated regex to handle Windows paths with spaces
                    const match = line.match(/(?:at\s+.*?\s+)?\(?([^()]+\.(ts|js|tsx|jsx|py|java|go|rb|php)):(\d+)(?::(\d+))?\)?/);
                    if (match) {
                        // Extract just the filename (not full path) for cleaner display
                        // Extract just the filename (not full path) for cleaner display
                        const fullPath = match[1];
                        const fileName = fullPath.split(/[/\\]/).pop() || fullPath;
                        fileLocationText = `${fileName}:${match[3]}`;
                        break;
                    }
                }

                // Parent item - the incident summary with file location
                const parentItem = new IncidentTreeItem(
                    incident.summary,
                    fileLocationText || `${timeAgo} • Click to expand`,
                    vscode.TreeItemCollapsibleState.Collapsed,
                    undefined,
                    new vscode.ThemeIcon('bug', new vscode.ThemeColor('errorForeground'))
                );

                // Store incident data for children
                (parentItem as any).incident = incident;
                (parentItem as any).isIncidentParent = true;

                items.push(parentItem);
            });
        }

        return Promise.resolve(items);
    }

    /**
     * Get human-readable time ago string
     */
    private getTimeAgo(date: Date): string {
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

        if (seconds < 60) return 'just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    }
}

class IncidentTreeItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly description: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        command?: vscode.Command,
        iconPath?: vscode.ThemeIcon
    ) {
        super(label, collapsibleState);
        this.tooltip = description;
        this.command = command;
        this.iconPath = iconPath;
    }
}
