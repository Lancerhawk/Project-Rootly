import axios from 'axios';

export interface GitHubUser {
    id: number;
    login: string;
    email: string | null;
    avatar_url: string;
}

export interface GitHubRepo {
    full_name: string;
    name: string;
    owner: {
        login: string;
    };
    private: boolean;
}

/**
 * Fetch GitHub user profile
 */
export async function fetchGitHubUser(accessToken: string): Promise<GitHubUser> {
    const response = await axios.get<GitHubUser>('https://api.github.com/user', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/vnd.github.v3+json',
        },
    });
    return response.data;
}

/**
 * Fetch user's GitHub repositories
 */
export async function fetchGitHubRepos(accessToken: string): Promise<GitHubRepo[]> {
    const response = await axios.get<GitHubRepo[]>('https://api.github.com/user/repos', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/vnd.github.v3+json',
        },
        params: {
            per_page: 100,
            sort: 'updated',
        },
    });
    return response.data;
}

/**
 * Verify user has access to a specific repository
 */
export async function verifyRepoAccess(
    accessToken: string,
    repoFullName: string
): Promise<boolean> {
    try {
        await axios.get(`https://api.github.com/repos/${repoFullName}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/vnd.github.v3+json',
            },
        });
        return true;
    } catch (error) {
        return false;
    }
}
