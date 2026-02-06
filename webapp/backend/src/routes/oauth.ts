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
        // Explicitly save session before redirecting to handle race conditions
        req.session.save((err) => {
            if (err) {
                console.error('Session save error:', err);
                return res.redirect(`${process.env.FRONTEND_URL}?error=session_save_failed`);
            }
            // Successful authentication, redirect to dashboard
            res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
        });
    }
);

export default router;