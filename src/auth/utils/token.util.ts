import * as crypto from 'crypto';

/**
 * Token Utility Functions
 * 
 * Provides helper functions for token management, including hashing
 * for secure storage in blacklist.
 */

/**
 * Hash a token for storage in blacklist
 * 
 * Why hash instead of storing raw tokens:
 * - Prevents token exposure if database is compromised
 * - Reduces storage size
 * - Maintains security even if blacklist is leaked
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Generate a secure random token for refresh tokens
 * 
 * Uses cryptographically secure random bytes for refresh token generation.
 * This is more secure than using JWT alone for refresh tokens.
 */
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Calculate token expiration timestamp
 */
export function getExpirationTimestamp(expiresInSeconds: number): Date {
  return new Date(Date.now() + expiresInSeconds * 1000);
}

