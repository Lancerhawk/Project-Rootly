import { Router } from 'express';
import passport from 'passport';

const router = Router();

// GitHub OAuth routes moved to oauth.ts

/**
 * GET /api/me
 * Get current authenticated user
 */
router.get('/me', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({
            error: {
                code: 'UNAUTHORIZED',
                message: 'Not authenticated',
            },
        });
    }

    // Strip sensitive token before sending to client
    const { githubAccessToken, ...userWithoutToken } = req.user as any;
    res.json(userWithoutToken);
});

/**
 * POST /api/logout
 * Logout current user
 */
router.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({
                error: {
                    code: 'LOGOUT_FAILED',
                    message: 'Failed to logout',
                },
            });
        }
        res.json({ success: true });
    });
});

export default router;
