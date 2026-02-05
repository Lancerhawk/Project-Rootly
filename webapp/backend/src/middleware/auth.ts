import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to ensure user is authenticated
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
    if (!req.isAuthenticated()) {
        return res.status(401).json({
            error: {
                code: 'UNAUTHORIZED',
                message: 'Authentication required',
            },
        });
    }
    next();
}

/**
 * Middleware to get current user from session
 */
export function getCurrentUser(req: Request) {
    return req.user as Express.User | undefined;
}
