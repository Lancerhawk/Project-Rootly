import { Request, Response, NextFunction } from 'express';
import { expressErrorHandler } from 'rootly-runtime';

/**
 * Global error handler middleware
 * Uses Rootly SDK to capture Express errors (5xx only)
 * Then sends HTTP response to client
 */
export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.error('Error:', err);

    // Use Rootly Express middleware to capture the error
    const rootlyMiddleware = expressErrorHandler();

    // Call Rootly middleware, then send response
    rootlyMiddleware(err, req, res, () => {
        const message = process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : err.message;

        res.status(500).json({
            error: {
                code: 'INTERNAL_ERROR',
                message,
            },
        });
    });
}
