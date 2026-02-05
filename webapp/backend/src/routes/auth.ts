import { Router } from 'express';
import passport from 'passport';

const router = Router();

/**
 * GET /auth/github
 * Redirect to GitHub OAuth
 */
router.get('/github', passport.authenticate('github', {
    scope: ['user:email', 'read:user', 'repo'],
}));

/**
 * GET /auth/github/callback
 * Handle GitHub OAuth callback
 */
router.get('/github/callback',
    passport.authenticate('github', { failureRedirect: process.env.FRONTEND_URL }),
    (req, res) => {
        // Successful authentication, redirect to dashboard
        res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
    }
);

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

    res.json(req.user);
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
