/**
 * rootly-runtime - Production-grade runtime error tracking for Node.js
 */

import { captureError, setDebugMode } from './runtime';
import { flush } from './transport';

interface InitOptions {
    apiKey: string;
    environment?: string;
    debug?: boolean;
}

const DEFAULT_API_URL = 'https://3.111.33.111.nip.io';

let isInitialized = false;
let apiKey: string;
let environment: 'production' | 'preview';
let apiUrl: string;

function normalizeEnvironment(env?: string): 'production' | 'preview' {
    if (!env) return 'production';
    const normalized = env.toLowerCase().trim();
    return (normalized === 'production' || normalized === 'prod') ? 'production' : 'preview';
}

export function init(options: InitOptions): void {
    try {
        if (!options.apiKey || typeof options.apiKey !== 'string') return;
        if (isInitialized) return;

        apiKey = options.apiKey;
        environment = normalizeEnvironment(options.environment || process.env.NODE_ENV);
        apiUrl = process.env.ROOTLY_API_URL?.trim() || DEFAULT_API_URL;
        isInitialized = true;

        if (options.debug) setDebugMode(true);

        // Global error handlers with automatic flush
        process.prependListener('uncaughtException', async (error) => {
            await handleError(error);
        });

        process.prependListener('unhandledRejection', async (reason) => {
            await handleRejection(reason);
        });

        // Graceful shutdown handlers
        process.on('beforeExit', async () => {
            await flush(200);
        });

        process.on('SIGTERM', async () => {
            await flush(200);
            process.exit(0);
        });
    } catch (error) {
        // Fail silently
    }
}

export function capture(error: Error, extraContext?: any, severity?: 'error' | 'warning' | 'info'): Promise<void> {
    try {
        if (!apiKey) return Promise.resolve();
        return captureError(error, apiKey, environment, apiUrl, extraContext, severity);
    } catch (err) {
        return Promise.resolve();
    }
}

export function wrap<T extends (...args: any[]) => any>(fn: T): T {
    return ((...args: any[]) => {
        try {
            const result = fn(...args);
            if (result && typeof result.then === 'function') {
                return result.catch((error: any) => {
                    const err = error instanceof Error ? error : new Error(String(error));
                    capture(err);
                    throw error;
                });
            }
            return result;
        } catch (error) {
            const err = error instanceof Error ? error : new Error(String(error));
            capture(err);
            throw error;
        }
    }) as T;
}

export function expressErrorHandler() {
    return async (err: any, req: any, res: any, next: any) => {
        try {
            if (!apiKey) return next(err);

            // Determine status code:
            // 1. Check err.status or err.statusCode (explicitly set on error object)
            // 2. Check res.statusCode ONLY if it's already 5xx (response already sent)
            // 3. Default to 500 (assume server error if no status set)
            let statusCode = err.status || err.statusCode;
            if (!statusCode && res.statusCode >= 500) {
                statusCode = res.statusCode;
            }
            if (!statusCode) {
                statusCode = 500; // Default to server error
            }

            // Only capture 5xx errors (server errors), not 4xx (client errors)
            if (statusCode >= 500) {
                const error = err instanceof Error ? err : new Error(String(err));
                const extraContext = {
                    source: 'express',
                    method: req.method,
                    path: req.path || req.url,
                    status_code: statusCode,
                };
                // Await the capture to ensure it completes before response is sent
                await captureError(error, apiKey, environment, apiUrl, extraContext);
            }
            next(err);
        } catch (error) {
            next(err);
        }
    };
}

async function handleError(error: Error): Promise<void> {
    try {
        await captureError(error, apiKey, environment, apiUrl);
        await flush(200); // Wait up to 200ms for request to complete
    } catch (err) {
        // Fail silently
    }
}

async function handleRejection(reason: any): Promise<void> {
    try {
        const error = reason instanceof Error ? reason : new Error(String(reason));
        await captureError(error, apiKey, environment, apiUrl);
        await flush(200); // Wait up to 200ms for request to complete
    } catch (err) {
        // Fail silently
    }
}

/**
 * Flush all pending error reports
 * Call this before your serverless function exits to ensure all errors are sent
 * 
 * @param timeoutMs - Maximum time to wait for pending requests (default: 5000ms)
 * @returns Promise that resolves when all requests complete or timeout
 * 
 * @example
 * // In serverless function
 * export async function handler(event) {
 *   try {
 *     // Your code
 *   } catch (error) {
 *     await capture(error);
 *     await flush(); // Ensure error is sent before function exits
 *   }
 * }
 */
export { flush };
