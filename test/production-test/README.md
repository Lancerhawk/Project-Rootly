# Rootly SDK Comprehensive Test Suite

A production-grade test application that demonstrates **every feature** of the Rootly SDK documented in the README. Organized into clear categories for systematic testing.

## Purpose

This application proves that the Rootly SDK works as documented by providing real, working examples of every feature mentioned in the SDK README. Deploy to Render and test each category to verify error capture.

## Quick Start

### Local Testing

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file:
   ```bash
   cp .env.example .env
   ```

3. Add your Rootly API key to `.env`:
   ```
   ROOTLY_API_KEY=your_actual_api_key
   ```

4. Run the app:
   ```bash
   npm start
   ```

5. Visit http://localhost:3000 to see all test categories

### Deploy to Render

1. Push this folder to GitHub
2. Create new Web Service on Render
3. Connect repository
4. Configure:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add environment variable: `ROOTLY_API_KEY`

## Test Categories

### Category 1: Normal Operations

**Purpose:** Verify the app runs normally without errors

```bash
# Health check
curl http://localhost:3000/health

# Get all users
curl http://localhost:3000/api/users

# Get specific user
curl http://localhost:3000/api/users/1

# Calculate
curl http://localhost:3000/api/calculate?a=10&b=2
```

**Expected:** No errors in Rootly dashboard

---

### Category 2: Automatic Error Capture

**Purpose:** Test SDK's automatic capture of uncaught exceptions and unhandled rejections

```bash
# Uncaught exception
curl http://localhost:3000/test/uncaught-exception

# Unhandled promise rejection
curl http://localhost:3000/test/unhandled-rejection

# Async error (not caught)
curl http://localhost:3000/test/async-error
```

**Expected:** 3 errors in Rootly dashboard with automatic capture

---

### Category 3: Manual Error Capture

**Purpose:** Test manual `capture()` function with context and severity levels

```bash
# Basic manual capture
curl http://localhost:3000/test/manual-capture

# Capture with context
curl "http://localhost:3000/test/capture-with-context?userId=12345"

# Severity levels (error, warning, info)
curl http://localhost:3000/test/severity-levels
```

**Expected:** 
- 1 basic error
- 1 error with user_id, action, endpoint context
- 3 errors with different severity levels (error, warning, info)

---

### Category 4: Express Middleware

**Purpose:** Test `expressErrorHandler()` middleware

```bash
# 5xx error (SHOULD be captured)
curl http://localhost:3000/test/express-500

# 4xx error (should NOT be captured)
curl http://localhost:3000/test/express-404

# Validation error (should NOT be captured)
curl -X POST http://localhost:3000/test/express-validation
```

**Expected:** Only the 500 error appears in Rootly (4xx errors are ignored)

---

### Category 5: Function Wrapping

**Purpose:** Test `wrap()` function for automatic error capture

```bash
# Wrapped sync function (will error)
curl "http://localhost:3000/test/wrapped-sync?value=-5"

# Wrapped sync function (success)
curl "http://localhost:3000/test/wrapped-sync?value=10"

# Wrapped async function (will error)
curl http://localhost:3000/test/wrapped-async

# Wrapped async function (success)
curl "http://localhost:3000/test/wrapped-async?userId=1"
```

**Expected:** 2 errors captured by wrap() and re-thrown

---

### Category 6: Serverless Simulation

**Purpose:** Test `flush()` for serverless environments

```bash
# Serverless success
curl http://localhost:3000/test/serverless-handler

# Serverless error with flush
curl "http://localhost:3000/test/serverless-handler?fail=true"
```

**Expected:** 1 error captured and flushed before response

---

### Category 7: Edge Cases (Real-World Errors)

**Purpose:** Test realistic production error scenarios

```bash
# Null reference error
curl "http://localhost:3000/test/null-reference?userId=999"

# Type error
curl "http://localhost:3000/test/type-error?a=hello&b=world"

# Database timeout (random)
curl http://localhost:3000/test/database-timeout

# Payment error - insufficient funds
curl -X POST http://localhost:3000/test/payment-error \
  -H "Content-Type: application/json" \
  -d '{"userId": 1, "amount": 5000}'

# Payment error - invalid user
curl -X POST http://localhost:3000/test/payment-error \
  -H "Content-Type: application/json" \
  -d '{"userId": 999, "amount": 100, "cardNumber": "1234567890123456"}'
```

**Expected:** Various real-world errors (null reference, type errors, etc.)

---

## Automated Testing

Run all tests automatically:

```bash
# Make script executable (Linux/Mac)
chmod +x test-errors.sh

# Run all tests
./test-errors.sh

# Or test against deployed app
./test-errors.sh https://your-app.onrender.com
```

## What to Verify

After running tests, check your Rootly dashboard for:

1. **Error Count:** All expected errors appear
2. **Error Messages:** Accurate and descriptive
3. **Stack Traces:** Point to correct line numbers
4. **Context Data:** Custom context appears (user_id, action, etc.)
5. **Severity Levels:** Errors show correct severity
6. **Deduplication:** Identical errors are deduplicated
7. **Express Context:** HTTP method, path, status code included

## SDK Features Demonstrated

This test suite covers **every feature** from the SDK README:

- [x] Automatic uncaught exception capture
- [x] Automatic unhandled rejection capture
- [x] Manual error capture with `capture()`
- [x] Custom context in error reports
- [x] Severity levels (error, warning, info)
- [x] Function wrapping with `wrap()`
- [x] Express middleware with `expressErrorHandler()`
- [x] Serverless support with `flush()`
- [x] Error deduplication
- [x] Rate limiting
- [x] Fail-silent operation
- [x] Environment detection
- [x] Commit SHA detection

## Environment Variables

- `ROOTLY_API_KEY` - Your Rootly API key (required)
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (default: production)

## Notes

- All errors are intentional and represent documented SDK features
- The app runs normally and doesn't crash
- Errors only occur when specific test endpoints are called
- This proves the SDK works exactly as documented in the README
