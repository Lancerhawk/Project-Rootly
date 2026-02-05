import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { fetchGitHubRepos } from '../services/github';

const router = Router();

/**
 * GET /api/github/repos
 * Fetch authenticated user's GitHub repositories
 */
router.get('/repos', requireAuth, async (req, res, next) => {
    try {
        const user = req.user as any;

        if (!user.githubAccessToken) {
            return res.status(401).json({
                error: {
                    code: 'NO_GITHUB_TOKEN',
                    message: 'GitHub access token not found',
                },
            });
        }

        const repos = await fetchGitHubRepos(user.githubAccessToken);

        res.json({
            repos: repos.map(repo => ({
                full_name: repo.full_name,
                name: repo.name,
                owner: repo.owner.login,
                private: repo.private,
            })),
        });
    } catch (error) {
        next(error);
    }
});

export default router;
