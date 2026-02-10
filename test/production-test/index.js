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
// HOME - Interactive Test UI
// ============================================
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rootly SDK Test Suite</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container { max-width: 1200px; margin: 0 auto; }
        h1 { 
            color: white; 
            text-align: center; 
            margin-bottom: 10px;
            font-size: 2.5em;
        }
        .subtitle {
            color: rgba(255,255,255,0.9);
            text-align: center;
            margin-bottom: 30px;
            font-size: 1.1em;
        }
        .category {
            background: white;
            border-radius: 12px;
            padding: 25px;
            margin-bottom: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .category h2 {
            color: #667eea;
            margin-bottom: 8px;
            font-size: 1.5em;
        }
        .category p {
            color: #666;
            margin-bottom: 15px;
            font-size: 0.95em;
        }
        .expected {
            background: #f0f4ff;
            padding: 8px 12px;
            border-radius: 6px;
            margin-bottom: 15px;
            font-size: 0.9em;
            color: #667eea;
            font-weight: 600;
        }
        .tests {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 10px;
        }
        .test-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 0.9em;
            transition: transform 0.2s, box-shadow 0.2s;
            text-align: left;
        }
        .test-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }
        .test-btn.success {
            background: linear-gradient(135deg, #56ab2f 0%, #a8e063 100%);
        }
        .result {
            margin-top: 20px;
            padding: 15px;
            border-radius: 8px;
            background: #f8f9fa;
            border-left: 4px solid #667eea;
            display: none;
        }
        .result.show { display: block; }
        .result pre {
            margin-top: 10px;
            padding: 10px;
            background: #fff;
            border-radius: 4px;
            overflow-x: auto;
            font-size: 0.85em;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔍 Rootly SDK Test Suite</h1>
        <p class="subtitle">Click any button to test SDK features. Check your Rootly dashboard for captured errors.</p>

        <div class="category">
            <h2>✅ Category 1: Normal Operations</h2>
            <p>These endpoints work correctly and should NOT generate errors</p>
            <div class="expected">Expected: 0 errors in Rootly</div>
            <div class="tests">
                <button class="test-btn success" onclick="test('/health')">Health Check</button>
                <button class="test-btn success" onclick="test('/api/users')">Get All Users</button>
                <button class="test-btn success" onclick="test('/api/users/1')">Get User #1</button>
                <button class="test-btn success" onclick="test('/api/calculate?a=10&b=2')">Calculate 10+2</button>
            </div>
        </div>

        <div class="category">
            <h2>🔴 Category 2: Automatic Error Capture</h2>
            <p>Tests SDK's automatic capture of uncaught exceptions and unhandled rejections</p>
            <div class="expected">Expected: 3 errors in Rootly</div>
            <div class="tests">
                <button class="test-btn" onclick="test('/test/uncaught-exception')">Uncaught Exception</button>
                <button class="test-btn" onclick="test('/test/unhandled-rejection')">Unhandled Rejection</button>
                <button class="test-btn" onclick="test('/test/async-error')">Async Error</button>
            </div>
        </div>

        <div class="category">
            <h2>📝 Category 3: Manual Error Capture</h2>
            <p>Tests manual capture() with context and severity levels</p>
            <div class="expected">Expected: 5 errors in Rootly</div>
            <div class="tests">
                <button class="test-btn" onclick="test('/test/manual-capture')">Basic Manual Capture</button>
                <button class="test-btn" onclick="test('/test/capture-with-context?userId=12345')">Capture with Context</button>
                <button class="test-btn" onclick="test('/test/severity-levels')">Severity Levels (3 errors)</button>
            </div>
        </div>

        <div class="category">
            <h2>🛠️ Category 4: Express Middleware</h2>
            <p>Tests Express error handler middleware (only 5xx errors captured)</p>
            <div class="expected">Expected: 1 error in Rootly (only the 500 error)</div>
            <div class="tests">
                <button class="test-btn" onclick="test('/test/express-500')">Express 500 (captured)</button>
                <button class="test-btn success" onclick="test('/test/express-404')">Express 404 (NOT captured)</button>
                <button class="test-btn success" onclick="testPost('/test/express-validation', {})">Validation Error (NOT captured)</button>
            </div>
        </div>

        <div class="category">
            <h2>🎁 Category 5: Function Wrapping</h2>
            <p>Tests wrap() for automatic error capture</p>
            <div class="expected">Expected: 2 errors in Rootly</div>
            <div class="tests">
                <button class="test-btn" onclick="test('/test/wrapped-sync?value=-5')">Wrapped Sync Error</button>
                <button class="test-btn success" onclick="test('/test/wrapped-sync?value=10')">Wrapped Sync Success</button>
                <button class="test-btn" onclick="test('/test/wrapped-async')">Wrapped Async Error</button>
                <button class="test-btn success" onclick="test('/test/wrapped-async?userId=1')">Wrapped Async Success</button>
            </div>
        </div>

        <div class="category">
            <h2>☁️ Category 6: Serverless Simulation</h2>
            <p>Tests flush() for serverless environments</p>
            <div class="expected">Expected: 1 error in Rootly</div>
            <div class="tests">
                <button class="test-btn success" onclick="test('/test/serverless-handler')">Serverless Success</button>
                <button class="test-btn" onclick="test('/test/serverless-handler?fail=true')">Serverless Error + Flush</button>
            </div>
        </div>

        <div class="category">
            <h2>⚠️ Category 7: Edge Cases</h2>
            <p>Real-world error scenarios</p>
            <div class="expected">Expected: 4-5 errors in Rootly</div>
            <div class="tests">
                <button class="test-btn" onclick="test('/test/null-reference?userId=999')">Null Reference Error</button>
                <button class="test-btn" onclick="test('/test/type-error?a=hello&b=world')">Type Error</button>
                <button class="test-btn" onclick="test('/test/database-timeout')">Database Timeout</button>
                <button class="test-btn" onclick="testPost('/test/payment-error', {userId:1,amount:5000})">Payment - Insufficient Funds</button>
                <button class="test-btn" onclick="testPost('/test/payment-error', {userId:999,amount:100,cardNumber:'1234567890123456'})">Payment - Invalid User</button>
            </div>
        </div>

        <div id="result" class="result">
            <strong>Response:</strong>
            <pre id="response"></pre>
        </div>
    </div>

    <script>
        async function test(url) {
            const result = document.getElementById('result');
            const response = document.getElementById('response');
            
            try {
                const res = await fetch(url);
                const data = await res.json();
                response.textContent = JSON.stringify(data, null, 2);
                result.classList.add('show');
            } catch (error) {
                response.textContent = 'Error: ' + error.message;
                result.classList.add('show');
            }
        }

        async function testPost(url, body) {
            const result = document.getElementById('result');
            const response = document.getElementById('response');
            
            try {
                const res = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                });
                const data = await res.json();
                response.textContent = JSON.stringify(data, null, 2);
                result.classList.add('show');
            } catch (error) {
                response.textContent = 'Error: ' + error.message;
                result.classList.add('show');
            }
        }
    </script>
</body>
</html>
    `);
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

app.get('/test/uncaught-exception', (req, res) => {
    setTimeout(() => {
        throw new Error('Uncaught exception test - This should appear in Rootly');
    }, 100);

    res.json({ message: 'Exception will be thrown asynchronously' });
});

app.get('/test/unhandled-rejection', (req, res) => {
    Promise.reject(new Error('Unhandled promise rejection test - This should appear in Rootly'));

    res.json({ message: 'Promise rejection triggered' });
});

app.get('/test/async-error', async (req, res) => {
    await failingAsyncOperation();
    res.json({ message: 'This will never be reached' });
});

async function failingAsyncOperation() {
    throw new Error('Async operation failed - This should appear in Rootly');
}

// ============================================
// CATEGORY 3: MANUAL ERROR CAPTURE
// ============================================

app.get('/test/manual-capture', async (req, res) => {
    try {
        throw new Error('Manual capture test');
    } catch (error) {
        await capture(error);
        res.json({
            message: 'Error captured manually',
            note: 'Check Rootly dashboard for this error'
        });
    }
});

app.get('/test/capture-with-context', async (req, res) => {
    try {
        const userId = req.query.userId || '12345';
        throw new Error('Operation failed with context');
    } catch (error) {
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

app.get('/test/severity-levels', async (req, res) => {
    try {
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

app.get('/test/express-500', (req, res, next) => {
    const error = new Error('Express 5xx error test');
    error.status = 500;
    next(error);
});

app.get('/test/express-404', (req, res, next) => {
    const error = new Error('Resource not found');
    error.status = 404;
    next(error);
});

app.post('/test/express-validation', (req, res, next) => {
    const error = new Error('Validation failed');
    error.status = 400;
    next(error);
});

// ============================================
// CATEGORY 5: FUNCTION WRAPPING
// ============================================

const wrappedSyncFunction = wrap((value) => {
    if (value < 0) {
        throw new Error('Wrapped sync function error - negative value not allowed');
    }
    return value * 2;
});

const wrappedAsyncFunction = wrap(async (userId) => {
    if (!userId) {
        throw new Error('Wrapped async function error - userId required');
    }

    await new Promise(resolve => setTimeout(resolve, 100));

    const user = users.find(u => u.id === parseInt(userId));
    if (!user) {
        throw new Error('Wrapped async function error - user not found');
    }

    return user;
});

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

app.get('/test/serverless-handler', async (req, res) => {
    try {
        const shouldFail = req.query.fail === 'true';

        if (shouldFail) {
            throw new Error('Serverless function error');
        }

        res.json({
            success: true,
            message: 'Serverless function completed'
        });
    } catch (error) {
        await capture(error, {
            function: 'serverless-handler',
            cold_start: false
        });

        await flush(2000);

        res.status(500).json({
            error: error.message,
            note: 'Error captured and flushed before response'
        });
    }
});

// ============================================
// CATEGORY 7: EDGE CASES
// ============================================

app.get('/test/null-reference', (req, res, next) => {
    try {
        const userId = parseInt(req.query.userId || '999');
        const user = users.find(u => u.id === userId);
        const userName = user.name.toUpperCase();
        res.json({ success: true, userName });
    } catch (error) {
        next(error);
    }
});

app.get('/test/type-error', (req, res, next) => {
    try {
        const a = req.query.a;
        const b = req.query.b;
        const result = a.toFixed(2) / b.toFixed(2);
        res.json({ success: true, result });
    } catch (error) {
        next(error);
    }
});

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
            if (Math.random() > 0.5) {
                reject(new Error('Database connection timeout'));
            } else {
                resolve({ data: 'Success' });
            }
        }, 100);
    });
}

app.post('/test/payment-error', async (req, res, next) => {
    try {
        const { userId, amount, cardNumber } = req.body;
        const user = users.find(u => u.id === userId);

        if (user.balance < amount) {
            throw new Error(`Insufficient funds. Required: ${amount}, Available: ${user.balance}`);
        }

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

app.use(expressErrorHandler());

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
    console.log(`Visit http://localhost:${PORT} for interactive test UI`);
    console.log('='.repeat(60));
});
