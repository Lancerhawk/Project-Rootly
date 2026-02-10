require('dotenv').config();
const express = require('express');
const { init, capture, wrap, expressErrorHandler, flush } = require('rootly-runtime');

// Initialize Rootly SDK with all configuration options
init({
    apiKey: process.env.ROOTLY_API_KEY,
    environment: process.env.NODE_ENV || 'production',
    debug: true // Enable to see SDK logs
});

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory data
const users = [
    { id: 1, name: 'Alice', email: 'alice@example.com', balance: 1000 },
    { id: 2, name: 'Bob', email: 'bob@example.com', balance: 500 }
];

// ============================================
// HOME - Test Categories
// ============================================
app.get('/', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Rootly SDK Comprehensive Test Suite',
        version: '1.0.0',
        categories: {
            'Normal Operations': {
                description: 'Working endpoints that should NOT generate errors',
                endpoints: [
                    'GET /health',
                    'GET /api/users',
                    'GET /api/users/1',
                    'GET /api/calculate?a=10&b=2'
                ]
            },
            'Automatic Error Capture': {
                description: 'Tests automatic capture of uncaught exceptions and unhandled rejections',
                endpoints: [
                    'GET /test/uncaught-exception',
                    'GET /test/unhandled-rejection',
                    'GET /test/async-error'
                ]
            },
            'Manual Error Capture': {
                description: 'Tests manual capture() with context and severity levels',
                endpoints: [
                    'GET /test/manual-capture',
                    'GET /test/capture-with-context',
                    'GET /test/severity-levels'
                ]
            },
            'Express Middleware': {
                description: 'Tests Express error handler middleware (5xx errors)',
                endpoints: [
                    'GET /test/express-500',
                    'GET /test/express-404',
                    'POST /test/express-validation'
                ]
            },
            'Function Wrapping': {
                description: 'Tests wrap() for automatic error capture',
                endpoints: [
                    'GET /test/wrapped-sync',
                    'GET /test/wrapped-async'
                ]
            },
            'Serverless Simulation': {
                description: 'Tests flush() for serverless environments',
                endpoints: [
                    'GET /test/serverless-handler'
                ]
            },
            'Edge Cases': {
                description: 'Real-world error scenarios',
                endpoints: [
                    'GET /test/null-reference',
                    'GET /test/type-error',
                    'GET /test/database-timeout',
                    'POST /test/payment-error'
                ]
            }
        }
    });
});

// ============================================
// CATEGORY 1: NORMAL OPERATIONS (No Errors)
// ============================================

app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/api/users', (req, res) => {
    res.json({ success: true, users });
});

app.get('/api/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true, user });
});

app.get('/api/calculate', (req, res) => {
    const a = parseFloat(req.query.a);
    const b = parseFloat(req.query.b);

    if (isNaN(a) || isNaN(b)) {
        return res.status(400).json({ error: 'Invalid numbers' });
    }

    res.json({
        success: true,
        result: a + b,
        operation: 'addition'
    });
});

// ============================================
// CATEGORY 2: AUTOMATIC ERROR CAPTURE
// ============================================

// Test 1: Uncaught Exception
app.get('/test/uncaught-exception', (req, res) => {
    // This will be caught by SDK's uncaughtException handler
    setTimeout(() => {
        throw new Error('Uncaught exception test - This should appear in Rootly');
    }, 100);

    res.json({ message: 'Exception will be thrown asynchronously' });
});

// Test 2: Unhandled Promise Rejection
app.get('/test/unhandled-rejection', (req, res) => {
    // This will be caught by SDK's unhandledRejection handler
    Promise.reject(new Error('Unhandled promise rejection test - This should appear in Rootly'));

    res.json({ message: 'Promise rejection triggered' });
});

// Test 3: Async Function Error (not caught)
app.get('/test/async-error', async (req, res) => {
    // Intentionally not using try/catch
    await failingAsyncOperation();
    res.json({ message: 'This will never be reached' });
});

async function failingAsyncOperation() {
    throw new Error('Async operation failed - This should appear in Rootly');
}

// ============================================
// CATEGORY 3: MANUAL ERROR CAPTURE
// ============================================

// Test 4: Basic Manual Capture
app.get('/test/manual-capture', async (req, res) => {
    try {
        throw new Error('Manual capture test');
    } catch (error) {
        // Manually capture the error
        await capture(error);
        res.json({
            message: 'Error captured manually',
            note: 'Check Rootly dashboard for this error'
        });
    }
});

// Test 5: Capture with Context
app.get('/test/capture-with-context', async (req, res) => {
    try {
        const userId = req.query.userId || '12345';
        throw new Error('Operation failed with context');
    } catch (error) {
        // Capture with additional context
        await capture(error, {
            user_id: req.query.userId || '12345',
            action: 'test_operation',
            endpoint: '/test/capture-with-context',
            timestamp: new Date().toISOString(),
            custom_data: {
                browser: req.headers['user-agent'],
                ip: req.ip
            }
        });

        res.json({
            message: 'Error captured with context',
            note: 'Check Rootly dashboard - should include user_id, action, etc.'
        });
    }
});

// Test 6: Severity Levels
app.get('/test/severity-levels', async (req, res) => {
    try {
        // Capture with different severity levels
        await capture(
            new Error('This is an ERROR level message'),
            { test: 'severity_error' },
            'error'
        );

        await capture(
            new Error('This is a WARNING level message'),
            { test: 'severity_warning' },
            'warning'
        );

        await capture(
            new Error('This is an INFO level message'),
            { test: 'severity_info' },
            'info'
        );

        res.json({
            message: 'Three errors captured with different severity levels',
            note: 'Check Rootly dashboard for error, warning, and info entries'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// CATEGORY 4: EXPRESS MIDDLEWARE
// ============================================

// Test 7: Express 5xx Error (Should be captured)
app.get('/test/express-500', (req, res, next) => {
    const error = new Error('Express 5xx error test');
    error.status = 500;
    next(error);
});

// Test 8: Express 4xx Error (Should NOT be captured)
app.get('/test/express-404', (req, res, next) => {
    const error = new Error('Resource not found');
    error.status = 404;
    next(error);
});

// Test 9: Validation Error (Should NOT be captured - 400)
app.post('/test/express-validation', (req, res, next) => {
    const error = new Error('Validation failed');
    error.status = 400;
    next(error);
});

// ============================================
// CATEGORY 5: FUNCTION WRAPPING
// ============================================

// Wrapped synchronous function
const wrappedSyncFunction = wrap((value) => {
    if (value < 0) {
        throw new Error('Wrapped sync function error - negative value not allowed');
    }
    return value * 2;
});

// Wrapped async function
const wrappedAsyncFunction = wrap(async (userId) => {
    if (!userId) {
        throw new Error('Wrapped async function error - userId required');
    }

    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 100));

    const user = users.find(u => u.id === parseInt(userId));
    if (!user) {
        throw new Error('Wrapped async function error - user not found');
    }

    return user;
});

// Test 10: Wrapped Sync Function
app.get('/test/wrapped-sync', (req, res) => {
    try {
        const value = parseInt(req.query.value || '-5');
        const result = wrappedSyncFunction(value);
        res.json({ success: true, result });
    } catch (error) {
        res.status(400).json({
            error: error.message,
            note: 'Error was captured by wrap() and re-thrown'
        });
    }
});

// Test 11: Wrapped Async Function
app.get('/test/wrapped-async', async (req, res) => {
    try {
        const userId = req.query.userId;
        const user = await wrappedAsyncFunction(userId);
        res.json({ success: true, user });
    } catch (error) {
        res.status(400).json({
            error: error.message,
            note: 'Error was captured by wrap() and re-thrown'
        });
    }
});

// ============================================
// CATEGORY 6: SERVERLESS SIMULATION
// ============================================

// Test 12: Serverless Handler with flush()
app.get('/test/serverless-handler', async (req, res) => {
    try {
        // Simulate serverless function
        const shouldFail = req.query.fail === 'true';

        if (shouldFail) {
            throw new Error('Serverless function error');
        }

        res.json({
            success: true,
            message: 'Serverless function completed'
        });
    } catch (error) {
        // Capture error and flush before response
        await capture(error, {
            function: 'serverless-handler',
            cold_start: false
        });

        // Wait for error to be sent (important in serverless)
        await flush(2000);

        res.status(500).json({
            error: error.message,
            note: 'Error captured and flushed before response'
        });
    }
});

// ============================================
// CATEGORY 7: EDGE CASES (Real-World Errors)
// ============================================

// Test 13: Null Reference Error
app.get('/test/null-reference', (req, res, next) => {
    try {
        const userId = parseInt(req.query.userId || '999');
        const user = users.find(u => u.id === userId);

        // BUG: Not checking if user exists
        const userName = user.name.toUpperCase();

        res.json({ success: true, userName });
    } catch (error) {
        next(error);
    }
});

// Test 14: Type Error
app.get('/test/type-error', (req, res, next) => {
    try {
        const a = req.query.a;
        const b = req.query.b;

        // BUG: Not validating types
        const result = a.toFixed(2) / b.toFixed(2);

        res.json({ success: true, result });
    } catch (error) {
        next(error);
    }
});

// Test 15: Database Timeout Simulation
app.get('/test/database-timeout', async (req, res, next) => {
    try {
        const result = await simulateDatabaseQuery();
        res.json({ success: true, result });
    } catch (error) {
        next(error);
    }
});

async function simulateDatabaseQuery() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Randomly fail to simulate timeout
            if (Math.random() > 0.5) {
                reject(new Error('Database connection timeout'));
            } else {
                resolve({ data: 'Success' });
            }
        }, 100);
    });
}

// Test 16: Payment Processing Error
app.post('/test/payment-error', async (req, res, next) => {
    try {
        const { userId, amount, cardNumber } = req.body;

        const user = users.find(u => u.id === userId);

        // BUG: Not checking if user exists
        if (user.balance < amount) {
            throw new Error(`Insufficient funds. Required: ${amount}, Available: ${user.balance}`);
        }

        // BUG: Not validating cardNumber
        const lastFour = cardNumber.slice(-4);

        user.balance -= amount;

        res.json({
            success: true,
            message: 'Payment processed',
            lastFour,
            newBalance: user.balance
        });
    } catch (error) {
        next(error);
    }
});

// ============================================
// ERROR HANDLERS
// ============================================

// Add Rootly Express error handler BEFORE final error handler
app.use(expressErrorHandler());

// Final error handler
app.use((err, req, res, next) => {
    console.error('Error:', err.message);

    const statusCode = err.status || 500;

    res.status(statusCode).json({
        error: err.message,
        status: statusCode,
        path: req.path,
        timestamp: new Date().toISOString()
    });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
    console.log('='.repeat(60));
    console.log('Rootly SDK Comprehensive Test Suite');
    console.log('='.repeat(60));
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'production'}`);
    console.log(`Debug mode: enabled`);
    console.log('');
    console.log(`Visit http://localhost:${PORT} for test categories`);
    console.log('='.repeat(60));
});
