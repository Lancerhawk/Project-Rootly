import { Router } from 'express';
import { capture } from 'rootly-runtime';

const router = Router();

/**
 * Test endpoint to verify Rootly SDK is working
 * GET /api/test/error - Triggers a test error
 */
router.get('/error', async (req, res) => {
    try {
        // Manually capture a test error
        const error = new Error('Test error from webapp backend - SDK integration test');
        await capture(error, {
            severity: 'error',
            extra_context: {
                source: 'webapp-backend-test',
                endpoint: '/api/test/error',
                timestamp: new Date().toISOString(),
                message: 'This is a test error to verify Rootly SDK is working'
            }
        });

        res.json({
            success: true,
            message: 'Test error captured and sent to Rootly',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to capture test error',
            error: error instanceof Error ? error.message : String(error)
        });
    }
});

/**
 * Test endpoint to trigger an uncaught error
 * GET /api/test/uncaught - Throws an error that should be caught by global handlers
 */
router.get('/uncaught', (req, res) => {
    // This will be caught by the global error handler and SDK
    throw new Error('Test uncaught error from webapp backend');
});

/**
 * Test endpoint to trigger an async error
 * GET /api/test/async-error - Triggers an async error
 */
router.get('/async-error', async (req, res, next) => {
    try {
        // Simulate async operation that fails
        await new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(new Error('Test async error from webapp backend'));
            }, 100);
        });
        res.json({ success: true });
    } catch (error) {
        // Pass to Express error handler
        next(error);
    }
});

/**
 * Health check for test routes
 * GET /api/test/health
 */
router.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Test routes are working',
        sdk_initialized: !!process.env.ROOTLY_API_KEY
    });
});

export default router;
