/**
 * Core error capture logic with deduplication and rate limiting
 */

import { buildContext } from './context';
import { sendPayload } from './transport';

const ROOTLY_CAPTURED = Symbol('rootly_captured');
const errorFingerprints = new Map<string, number>();
const DEDUP_WINDOW_MS = 10000;
const MAX_FINGERPRINTS = 500;
const errorTimestamps: number[] = [];
const RATE_LIMIT_MAX = 20;
const RATE_LIMIT_WINDOW_MS = 60000;

let debugMode = false;

export function setDebugMode(enabled: boolean): void {
    debugMode = enabled;
}

function debugLog(message: string): void {
    if (debugMode) process.stderr.write(`[Rootly SDK] ${message}\n`);
}

function getStableStackFrame(stack: string): string {
    try {
        const lines = stack.split('\n');
        // Skip first line (error message), find first non-empty stack frame
        for (let i = 1; i < lines.length; i++) {
            const trimmed = lines[i].trim();
            if (trimmed) return trimmed.replace(/\s+/g, ' ');
        }
        return '';
    } catch (err) {
        return '';
    }
}

function computeFingerprint(error: Error): string {
    try {
        const message = error.message || 'Unknown';
        const stableFrame = getStableStackFrame(error.stack || '');
        return `${message}:${stableFrame}`;
    } catch (err) {
        return 'unknown';
    }
}

function shouldDeduplicate(fingerprint: string): boolean {
    const now = Date.now();
    const lastSeen = errorFingerprints.get(fingerprint);
    if (lastSeen && now - lastSeen < DEDUP_WINDOW_MS) {
        debugLog('Duplicate error suppressed');
        return true;
    }
    errorFingerprints.set(fingerprint, now);
    if (errorFingerprints.size > MAX_FINGERPRINTS) {
        const oldestKey = errorFingerprints.keys().next().value;
        if (oldestKey) errorFingerprints.delete(oldestKey);
    }
    return false;
}

function isRateLimited(): boolean {
    const now = Date.now();
    const cutoff = now - RATE_LIMIT_WINDOW_MS;
    while (errorTimestamps.length > 0 && errorTimestamps[0] < cutoff) {
        errorTimestamps.shift();
    }
    if (errorTimestamps.length >= RATE_LIMIT_MAX) {
        debugLog('Rate limit exceeded');
        return true;
    }
    errorTimestamps.push(now);
    return false;
}

/**
 * Capture error asynchronously
 */
export function captureError(
    error: Error,
    apiKey: string,
    environment: string,
    apiUrl: string,
    extraContext?: any,
    severity?: 'error' | 'warning' | 'info'
): Promise<void> {
    try {
        // Recursive capture protection
        if ((error as any)[ROOTLY_CAPTURED]) {
            debugLog('Recursive capture prevented');
            return Promise.resolve();
        }
        (error as any)[ROOTLY_CAPTURED] = true;

        const fingerprint = computeFingerprint(error);
        if (shouldDeduplicate(fingerprint)) return Promise.resolve();
        if (isRateLimited()) return Promise.resolve();

        const payload = {
            error: {
                message: error.message || 'Unknown error',
                type: error.name || 'Error',
                stack: error.stack || 'No stack trace available',
                severity: severity ?? 'error',
            },
            context: buildContext(environment, extraContext),
        };
        debugLog(`Sending: ${error.message} (${severity ?? 'error'})`);
        return sendPayload(payload, apiKey, apiUrl);
    } catch (err) {
        return Promise.resolve();
    }
}
