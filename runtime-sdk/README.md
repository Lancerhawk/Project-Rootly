# rootly-runtime

Runtime error tracking SDK for Node.js applications. Captures production errors and sends them to your Rootly dashboard with full context and stack traces.

## What is this?

`rootly-runtime` is a lightweight error tracking library that monitors your Node.js application for errors and automatically reports them to Rootly. When an error occurs in production, you'll see it in your IDE with the exact line of code that caused it, along with the full stack trace and request context.

**IMPORTANT: This SDK is currently in beta.** While we've tested it extensively, some errors may not be captured reliably across all platforms and scenarios. We do not guarantee 100% error detection. Manual `capture()` calls are the most reliable method across all environments.

## Installation

```bash
npm install rootly-runtime
```

## Basic Setup

Add these two lines at the very top of your application entry point (before any other imports):

```javascript
const { init } = require('rootly-runtime');

init({
  apiKey: process.env.ROOTLY_API_KEY
});
```

That's it. The SDK will now automatically capture uncaught exceptions and unhandled promise rejections.

## How It Works

Once initialized, the SDK:

1. Registers global error handlers for `uncaughtException` and `unhandledRejection`
2. Captures error details (message, stack trace, environment info)
3. Sends error reports to Rootly's backend via HTTP POST
4. Deduplicates identical errors (10-second window)
5. Rate limits to prevent overwhelming your dashboard (20 errors per 60 seconds)

The SDK is designed to fail silently - if it encounters any issues sending error reports, it will not crash your application.

## Configuration Options

```javascript
init({
  apiKey: 'your-api-key',        // Required: Get this from your Rootly dashboard
  environment: 'production',     // Optional: 'production' or 'preview' (default: NODE_ENV)
  debug: false                   // Optional: Enable debug logging (default: false)
});
```

### Environment Detection

The SDK normalizes environment values:
- `'production'` or `'prod'` → `'production'`
- Anything else → `'preview'`

If you don't specify an environment, it uses `process.env.NODE_ENV` or defaults to `'production'`.

## Usage Examples

### Automatic Error Capture

The SDK automatically captures these error types:

```javascript
// Uncaught exceptions
throw new Error('Something went wrong');

// Unhandled promise rejections
Promise.reject(new Error('Async operation failed'));

// Async/await errors (if not caught)
async function fetchData() {
  throw new Error('Database connection failed');
}
```

### Manual Error Capture

For errors you catch in try/catch blocks, use `capture()` to report them:

```javascript
const { capture } = require('rootly-runtime');

try {
  const result = riskyOperation();
} catch (error) {
  // Send to Rootly with additional context
  capture(error, {
    user_id: '12345',
    action: 'checkout',
    cart_total: 99.99
  });
  
  // Handle the error gracefully
  res.status(500).json({ error: 'Payment processing failed' });
}
```

The second parameter accepts any JSON-serializable object. This context will appear in your Rootly dashboard alongside the error.

### Severity Levels

You can specify error severity as the third parameter:

```javascript
// Error (default)
capture(error, { user_id: '123' }, 'error');

// Warning
capture(new Error('Deprecated API used'), { endpoint: '/old-api' }, 'warning');

// Info
capture(new Error('Migration completed'), { records: 1000 }, 'info');
```

### Express Middleware

For Express applications, use the error handler middleware to automatically capture 5xx errors:

```javascript
const express = require('express');
const { init, expressErrorHandler } = require('rootly-runtime');

init({ apiKey: process.env.ROOTLY_API_KEY });

const app = express();

// Your routes
app.get('/api/users', (req, res) => {
  // Your code
});

// Add Rootly error handler BEFORE your final error handler
app.use(expressErrorHandler());

// Your final error handler
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});
```

The middleware only captures errors when `res.statusCode >= 500`. It ignores 4xx errors (validation, authentication, etc.) and adds Express-specific context like HTTP method, path, and status code.

### Function Wrapping

Wrap functions to automatically capture and re-throw errors:

```javascript
const { wrap } = require('rootly-runtime');

// Synchronous function
const processPayment = wrap((amount) => {
  if (amount < 0) throw new Error('Invalid amount');
  return { success: true };
});

// Async function
const fetchUser = wrap(async (userId) => {
  const response = await fetch(`/api/users/${userId}`);
  if (!response.ok) throw new Error('User not found');
  return response.json();
});

// Errors are captured AND re-thrown
try {
  await fetchUser('123');
} catch (error) {
  // Error was sent to Rootly, now handle it
  console.error('Failed to fetch user');
}
```

### Serverless Functions (Vercel, AWS Lambda)

For serverless environments, use `flush()` to ensure error reports complete before the function exits:

```javascript
const { init, capture, flush } = require('rootly-runtime');

init({ apiKey: process.env.ROOTLY_API_KEY });

export default async function handler(req, res) {
  try {
    const result = await processRequest(req);
    res.status(200).json(result);
  } catch (error) {
    await capture(error, { path: req.url });
    await flush(); // Wait for error to be sent
    res.status(500).json({ error: 'Internal server error' });
  }
}
```

**Note:** Automatic error capture (uncaught exceptions, unhandled rejections) may not work reliably in Vercel serverless functions due to platform limitations. Use manual `capture()` calls for guaranteed error reporting in serverless environments.

## Platform Support

The SDK has been tested on:

- Traditional Node.js servers
- Express.js applications
- Render deployments
- Railway deployments
- GitHub Actions
- Vercel (manual capture only)
- AWS Lambda (manual capture recommended)

**Beta Notice:** Error capture reliability varies across platforms. Some errors may not be captured consistently. Manual `capture()` is the most reliable method.

## API Reference

### `init(options)`

Initialize the SDK. Must be called before any other SDK functions.

**Parameters:**
- `options.apiKey` (string, required) - Your Rootly API key
- `options.environment` (string, optional) - Environment name ('production' or 'preview')
- `options.debug` (boolean, optional) - Enable debug logging

**Returns:** void

### `capture(error, context?, severity?)`

Manually capture an error.

**Parameters:**
- `error` (Error | string, required) - The error to capture
- `context` (object, optional) - Additional context (must be JSON-serializable)
- `severity` ('error' | 'warning' | 'info', optional) - Error severity (default: 'error')

**Returns:** Promise<void>

### `wrap(fn)`

Wrap a function to automatically capture errors.

**Parameters:**
- `fn` (Function, required) - Function to wrap (sync or async)

**Returns:** Wrapped function that captures and re-throws errors

### `expressErrorHandler()`

Express middleware for automatic 5xx error capture.

**Returns:** Express error handler middleware

### `flush(timeout?)`

Wait for all pending error reports to complete.

**Parameters:**
- `timeout` (number, optional) - Max wait time in milliseconds (default: 5000)

**Returns:** Promise<void>

## Environment Variables

The SDK automatically detects commit SHA from these environment variables:

- `RENDER_GIT_COMMIT` (Render)
- `RAILWAY_GIT_COMMIT_SHA` (Railway)
- `VERCEL_GIT_COMMIT_SHA` (Vercel)
- `GITHUB_SHA` (GitHub Actions)

You can also set `ROOTLY_API_URL` to use a custom backend endpoint (defaults to `https://rootly-backend.onrender.com`).

## Error Deduplication

The SDK deduplicates errors based on a fingerprint generated from:
- Error message
- Stack trace
- File path and line number

Identical errors within a 10-second window are deduplicated to prevent spam.

## Rate Limiting

To prevent overwhelming your dashboard, the SDK limits error reporting to 20 errors per 60 seconds. Additional errors are dropped silently.

## Fail-Silent Design

The SDK is designed to never crash your application. If error reporting fails (network issues, invalid API key, etc.), the SDK logs the failure (if debug mode is enabled) and continues silently.

## TypeScript Support

The SDK includes TypeScript type definitions:

```typescript
import { init, capture, wrap, expressErrorHandler, flush } from 'rootly-runtime';

init({
  apiKey: process.env.ROOTLY_API_KEY!,
  environment: 'production',
  debug: true
});

capture(new Error('Type-safe error'), { userId: 123 }, 'error');
```

## Troubleshooting

### Errors not appearing in dashboard

1. Check your API key is correct
2. Enable debug mode: `init({ apiKey: '...', debug: true })`
3. Check console for SDK debug messages
4. Verify network connectivity to Rootly backend
5. Try manual `capture()` to test connectivity

### Serverless functions timing out

Use `flush()` to wait for error reports:

```javascript
await capture(error);
await flush(2000); // Wait up to 2 seconds
```

### Too many errors being captured

The SDK automatically rate limits to 20 errors per 60 seconds. If you're hitting this limit, you may have a critical bug causing error loops.

## Development

### Building from Source

To build the SDK from source, you need to configure the build environment:

1. Create a `.env` file in the `runtime-sdk` directory:
   ```bash
   ROOTLY_API_URL=https://your-backend-url.com
   ```

2. Run the build script:
   ```bash
   npm run build
   ```

The build script will compile the TypeScript code and inject the API URL from your `.env` file into the generated JavaScript.

## License

MIT

## Support

For issues and questions:
- GitHub: https://github.com/Lancerhawk/Project-Rootly
- Documentation: https://project-rootly.vercel.app/docs

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history and release notes.
