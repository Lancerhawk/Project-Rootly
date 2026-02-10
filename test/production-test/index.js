require('dotenv').config();
const express = require('express');
const { init, capture, expressErrorHandler } = require('rootly-runtime');

// Initialize Rootly SDK
init({
    apiKey: process.env.ROOTLY_API_KEY,
    environment: 'production',
    debug: true
});

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory database simulation
const users = [
    { id: 1, name: 'Alice', email: 'alice@example.com', balance: 1000 },
    { id: 2, name: 'Bob', email: 'bob@example.com', balance: 500 }
];

const orders = [];

// ============================================
// NORMAL ENDPOINTS (Working correctly)
// ============================================

// Health check
app.get('/', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Rootly Production Test App',
        version: '1.0.0',
        endpoints: {
            health: '/',
            users: '/api/users',
            user: '/api/users/:id',
            createOrder: 'POST /api/orders',
            processPayment: 'POST /api/payments',
            divideNumbers: '/api/divide?a=10&b=2',
            asyncOperation: '/api/async-task',
            databaseQuery: '/api/db/query?table=users'
        }
    });
});

// Get all users
app.get('/api/users', (req, res) => {
    res.json({ success: true, users });
});

// ============================================
// ERROR SCENARIO 1: Null Reference Error
// ============================================
app.get('/api/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);

    // BUG: Not checking if user exists before accessing properties
    // This will throw "Cannot read property 'name' of undefined"
    const userName = user.name.toUpperCase();

    res.json({ success: true, user: userName });
});

// ============================================
// ERROR SCENARIO 2: Division by Zero / Type Error
// ============================================
app.get('/api/divide', (req, res) => {
    const a = parseFloat(req.query.a);
    const b = parseFloat(req.query.b);

    // BUG: Not validating input or checking for division by zero
    // Can throw errors if a or b are not numbers
    const result = a / b;

    // BUG: Trying to call method on potentially Infinity/NaN
    const formatted = result.toFixed(2);

    res.json({ success: true, result: formatted });
});

// ============================================
// ERROR SCENARIO 3: Async Promise Rejection
// ============================================
app.get('/api/async-task', async (req, res) => {
    try {
        // Simulate async operation that might fail
        const data = await fetchExternalData(req.query.userId);
        res.json({ success: true, data });
    } catch (error) {
        // BUG: Catching but not properly handling
        // Sometimes we forget to capture or respond
        console.error('Async error:', error.message);
        // Forgot to send response - will cause timeout
    }
});

async function fetchExternalData(userId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (!userId) {
                // BUG: Rejecting with string instead of Error object
                reject('User ID is required');
            }

            // BUG: Trying to access property of undefined
            const user = users.find(u => u.id === parseInt(userId));
            resolve({ name: user.name, email: user.email });
        }, 100);
    });
}

// ============================================
// ERROR SCENARIO 4: Database Query Error
// ============================================
app.get('/api/db/query', (req, res) => {
    const table = req.query.table;

    // BUG: SQL injection vulnerable + no error handling
    const query = `SELECT * FROM ${table} WHERE active = 1`;

    // Simulate database query
    executeQuery(query)
        .then(results => res.json({ success: true, results }))
        .catch(err => {
            // BUG: Throwing error in promise catch
            throw new Error(`Database query failed: ${err.message}`);
        });
});

function executeQuery(query) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate random database failures
            if (Math.random() > 0.7) {
                reject(new Error('Connection timeout'));
            }

            // BUG: Accessing undefined property
            const results = query.results.map(r => r.id);
            resolve(results);
        }, 50);
    });
}

// ============================================
// ERROR SCENARIO 5: Payment Processing Error
// ============================================
app.post('/api/payments', express.json(), (req, res) => {
    const { userId, amount, cardNumber } = req.body;

    // BUG: Not validating required fields
    const user = users.find(u => u.id === userId);

    // BUG: Type coercion issues
    if (user.balance < amount) {
        throw new Error('Insufficient funds');
    }

    // BUG: Accessing property of potentially undefined
    const lastFourDigits = cardNumber.slice(-4);

    // Process payment
    user.balance -= amount;

    res.json({
        success: true,
        message: 'Payment processed',
        newBalance: user.balance
    });
});

// ============================================
// ERROR SCENARIO 6: Order Creation with Validation
// ============================================
app.post('/api/orders', express.json(), (req, res) => {
    const { userId, items, total } = req.body;

    // BUG: Assuming items is always an array
    const itemCount = items.length;

    // BUG: Not checking if user exists
    const user = users.find(u => u.id === userId);

    // BUG: Potential type mismatch
    if (total > user.balance) {
        // This will throw if user is undefined
        throw new Error(`Insufficient balance. Required: ${total}, Available: ${user.balance}`);
    }

    // BUG: Array method on potentially undefined
    const itemNames = items.map(item => item.name.toUpperCase());

    const order = {
        id: orders.length + 1,
        userId,
        items: itemNames,
        total,
        status: 'pending'
    };

    orders.push(order);

    res.json({ success: true, order });
});

// ============================================
// ERROR SCENARIO 7: Unhandled Rejection
// ============================================
app.get('/api/unhandled-promise', (req, res) => {
    // BUG: Promise rejection without catch
    Promise.reject(new Error('Unhandled promise rejection in endpoint'));

    res.json({ success: true, message: 'Request sent' });
});

// ============================================
// ERROR SCENARIO 8: Synchronous Exception
// ============================================
app.get('/api/sync-error', (req, res) => {
    // BUG: Intentional synchronous error
    const config = JSON.parse(req.query.config);

    res.json({ success: true, config });
});

// Add Rootly error handler BEFORE final error handler
app.use(expressErrorHandler());

// Final error handler
app.use((err, req, res, next) => {
    console.error('❌ Error caught by Express:', err.message);
    res.status(err.status || 500).json({
        error: err.message,
        status: err.status || 500
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Production Test App running on port ${PORT}`);
    console.log(`🔍 Rootly SDK initialized with debug mode`);
    console.log(`📍 Visit http://localhost:${PORT} for available endpoints`);
});
