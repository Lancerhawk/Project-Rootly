import * as https from 'https';
import * as http from 'http';

let pendingRequests = 0;
const activeRequests: Set<Promise<void>> = new Set();

export function getPendingRequests(): number {
    return pendingRequests;
}

/**
 * Send payload asynchronously and return a promise
 */
export function sendPayload(payload: any, apiKey: string, apiUrl: string): Promise<void> {
    const promise = new Promise<void>((resolve) => {
        try {
            const data = JSON.stringify(payload);
            const url = new URL(apiUrl + '/api/ingest');
            const isHttps = url.protocol === 'https:';
            const options = {
                hostname: url.hostname,
                port: url.port || (isHttps ? 443 : 80),
                path: url.pathname,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(data),
                    'Authorization': `Bearer ${apiKey}`,
                },
                timeout: 5000,
            };

            pendingRequests++;
            const client = isHttps ? https : http;
            const req = client.request(options, (res) => {
                res.on('data', () => { });
                res.on('end', () => {
                    pendingRequests--;
                    resolve();
                });
            });

            req.on('error', () => {
                pendingRequests--;
                resolve(); // Resolve even on error (fail silently)
            });

            req.on('timeout', () => {
                req.destroy();
                pendingRequests--;
                resolve();
            });

            req.write(data);
            req.end();
        } catch (err) {
            resolve(); // Resolve even on error
        }
    });

    activeRequests.add(promise);
    promise.finally(() => activeRequests.delete(promise));

    return promise;
}

/**
 * Wait for all pending requests to complete
 * Essential for serverless environments - call before function exits
 */
export async function flush(timeoutMs: number = 5000): Promise<void> {
    if (activeRequests.size === 0) return;

    try {
        await Promise.race([
            Promise.all(Array.from(activeRequests)),
            new Promise<void>((resolve) => setTimeout(resolve, timeoutMs))
        ]);
    } catch (err) {
        // Fail silently
    }
}
