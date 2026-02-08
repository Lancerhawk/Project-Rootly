import * as vscode from 'vscode';

const TOKEN_KEY = 'rootly.authToken';
// const BACKEND_URL = 'http://localhost:3001';
const BACKEND_URL = 'https://3.111.33.111.nip.io';

/**
 * Authenticate user via GitHub OAuth
 */
export async function login(context: vscode.ExtensionContext): Promise<string | null> {
    try {
        // Open browser to GitHub OAuth with IDE source parameter
        const authUrl = `${BACKEND_URL}/auth/github?source=ide`;

        vscode.window.showInformationMessage('Opening browser for GitHub authentication...');
        await vscode.env.openExternal(vscode.Uri.parse(authUrl));

        // Prompt user to paste token from browser
        const token = await vscode.window.showInputBox({
            prompt: 'Paste the session token from your browser',
            password: true,
            ignoreFocusOut: true,
            placeHolder: 'Session token will be displayed in the browser after authentication'
        });

        if (!token) {
            return null;
        }

        // Store token securely
        await context.secrets.store(TOKEN_KEY, token);
        vscode.window.showInformationMessage('✅ Successfully logged in to Rootly');

        return token;
    } catch (error) {
        vscode.window.showErrorMessage(`Login failed: ${error}`);
        return null;
    }
}

/**
 * Get stored authentication token
 */
export async function getToken(context: vscode.ExtensionContext): Promise<string | null> {
    return await context.secrets.get(TOKEN_KEY) || null;
}

/**
 * Clear stored token (logout)
 */
export async function logout(context: vscode.ExtensionContext): Promise<void> {
    await context.secrets.delete(TOKEN_KEY);
    vscode.window.showInformationMessage('Logged out of Rootly');
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(context: vscode.ExtensionContext): Promise<boolean> {
    const token = await getToken(context);
    return token !== null;
}
