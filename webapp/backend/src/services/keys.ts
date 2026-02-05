import crypto from 'crypto';
import bcrypt from 'bcrypt';

/**
 * Generate a unique project ID
 * Format: proj_<24 random chars>
 */
export function generateProjectId(): string {
    const random = crypto.randomBytes(18).toString('base64url');
    return `proj_${random}`;
}

/**
 * Generate a unique API key
 * Format: key_<48 random chars>
 */
export function generateApiKey(): string {
    const random = crypto.randomBytes(36).toString('base64url');
    return `key_${random}`;
}

/**
 * Generate a unique incident ID
 * Format: inc_<24 random chars>
 */
export function generateIncidentId(): string {
    const random = crypto.randomBytes(18).toString('base64url');
    return `inc_${random}`;
}

/**
 * Hash an API key using bcrypt
 */
export async function hashApiKey(key: string): Promise<string> {
    return bcrypt.hash(key, 10);
}

/**
 * Verify an API key against its hash
 */
export async function verifyApiKey(key: string, hash: string): Promise<boolean> {
    return bcrypt.compare(key, hash);
}
