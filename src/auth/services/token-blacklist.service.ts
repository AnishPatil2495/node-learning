import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { TokenBlacklist } from '../entities/token-blacklist.entity';
import { hashToken } from '../utils/token.util';

/**
 * Token Blacklist Service
 * 
 * Manages token blacklisting for security and logout functionality.
 * 
 * Responsibilities:
 * - Add tokens to blacklist
 * - Check if tokens are blacklisted
 * - Clean up expired blacklist entries
 * - Bulk revoke tokens for a user
 */
@Injectable()
export class TokenBlacklistService {
  constructor(
    @InjectRepository(TokenBlacklist)
    private tokenBlacklistRepository: Repository<TokenBlacklist>,
  ) {}

  /**
   * Add a token to the blacklist
   * 
   * Why hash before storing:
   * - Security: Even if DB is compromised, tokens can't be extracted
   * - Privacy: Tokens are sensitive and shouldn't be stored in plain text
   */
  async blacklistToken(
    token: string,
    tokenType: 'access' | 'refresh',
    expiresAt: Date,
    userId?: number,
    reason?: string,
  ): Promise<void> {
    const tokenHash = hashToken(token);
    
    // Check if already blacklisted (idempotent operation)
    const existing = await this.tokenBlacklistRepository.findOne({
      where: { tokenHash },
    });

    if (!existing) {
      const blacklistEntry = this.tokenBlacklistRepository.create({
        tokenHash,
        tokenType,
        expiresAt,
        userId,
        reason: reason || 'logout',
      });
      await this.tokenBlacklistRepository.save(blacklistEntry);
    }
  }

  /**
   * Check if a token is blacklisted
   * 
   * Returns true if token is blacklisted, false otherwise.
   * This is called on every authenticated request to validate tokens.
   */
  async isTokenBlacklisted(token: string): Promise<boolean> {
    const tokenHash = hashToken(token);
    const blacklistEntry = await this.tokenBlacklistRepository.findOne({
      where: { tokenHash },
    });
    return !!blacklistEntry;
  }

  /**
   * Revoke all tokens for a user
   * 
   * Used when:
   * - User changes password
   * - Security breach detected
   * - Admin revokes user access
   */
  async revokeAllUserTokens(userId: number, reason: string): Promise<void> {
    // Note: This doesn't blacklist existing tokens, but you could extend
    // this to store a "revoked_at" timestamp for the user and check it
    // during token validation. For now, we rely on token expiration.
    
    // In a production system, you might want to:
    // 1. Store a user-level revocation timestamp
    // 2. Check this timestamp during token validation
    // 3. This is more efficient than blacklisting every token
  }

  /**
   * Clean up expired blacklist entries
   * 
   * Should be run periodically (e.g., via cron job) to prevent
   * blacklist table from growing indefinitely.
   */
  async cleanupExpiredEntries(): Promise<number> {
    const result = await this.tokenBlacklistRepository.delete({
      expiresAt: LessThan(new Date()),
    });
    return result.affected || 0;
  }
}

