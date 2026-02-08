import * as vscode from 'vscode';

// const BACKEND_URL = 'http://localhost:3001';
const BACKEND_URL = 'https://3.111.33.111.nip.io';

/**
 * Incident type matching backend API response
 */
export interface Incident {
    incident_id: string;
    summary: string;
    status: string;
    environment: string;
    commit_sha: string;
    occurred_at: string;
    stack_trace: string | null;
    error_type: string | null;
}

/**
 * API response wrapper
 */
interface IncidentsResponse {
    incidents: Incident[];
}

/**
 * Fetch incidents for a repository
 * @param repo - Repository in "owner/repo" format
 * @param sessionId - Session ID for authentication
 * @returns Array of incidents
 * @throws Error with specific messages for different failure cases
 */
export async function fetchIncidents(repo: string, sessionId: string): Promise<Incident[]> {
    try {
        const url = `${BACKEND_URL}/api/incidents?repo=${encodeURIComponent(repo)}&status=open`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': sessionId, // Full cookie header
            },
        });

        // Handle different error status codes

        const data = await response.json() as IncidentsResponse;
        return data.incidents || [];

    } catch (error) {
        // Re-throw known errors
        if (error instanceof Error && (
            error.message === 'UNAUTHORIZED' ||
            error.message === 'PROJECT_NOT_FOUND' ||
            error.message.startsWith('BAD_REQUEST') ||
            error.message.startsWith('HTTP_ERROR')
        )) {
            throw error;
        }

        // Network or other errors
        if (error instanceof Error) {
            throw new Error(`NETWORK_ERROR: ${error.message}`);
        }

        throw new Error('UNKNOWN_ERROR');
    }
}

/**
 * Verify if a repository is registered for the authenticated user
 * @param repo - Repository in "owner/repo" format
 * @param sessionId - Session ID from authentication
 * @returns true if project exists and user is authorized, false otherwise
 */
export async function verifyProject(repo: string, sessionId: string): Promise<boolean> {
    try {
        const url = `${BACKEND_URL}/api/projects/verify?repo=${encodeURIComponent(repo)}`;
        console.log('🔍 [API] Verifying:', repo, 'SessionID:', sessionId.substring(0, 10) + '...');

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': sessionId, // Full cookie header
            },
        });

        if (response.status === 404) {
            return false;
        }

        if (!response.ok) {
            return false;
        }

        const data = await response.json() as any;
        return data.exists === true;

    } catch (error) {
        return false;
    }
}

/**
 * Get GitHub username from session
 * @param sessionId - Session ID
 * @returns GitHub username or null if unable to fetch
 */
export async function getUsernameFromSession(sessionId: string): Promise<string | null> {
    try {
        const url = `${BACKEND_URL}/api/me`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': sessionId, // Full cookie header
            },
        });

        if (!response.ok) {
            return null;
        }

        const data = await response.json() as any;
        return data.githubUsername || data.username || null;
    } catch (error) {
        return null;
    }
}
