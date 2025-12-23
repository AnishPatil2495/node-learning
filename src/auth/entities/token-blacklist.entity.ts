import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

/**
 * Token Blacklist Entity
 *
 * Stores revoked tokens (both access and refresh tokens) to prevent their reuse.
 * This is critical for security when implementing logout and token revocation.
 *
 * Why this approach:
 * - Allows immediate token invalidation on logout
 * - Prevents token replay attacks
 * - Supports token rotation by blacklisting old refresh tokens
 * - Can be extended to support token expiration cleanup
 */
@Entity('token_blacklist')
@Index(['tokenHash'], { unique: true })
@Index(['expiresAt'])
export class TokenBlacklist {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * JWT token (access or refresh) that has been revoked
   * Stored as a hash for security (we'll hash it before storing)
   */
  @Column({ type: 'text', unique: true })
  tokenHash: string;

  /**
   * Token type: 'access' or 'refresh'
   * Helps with cleanup and auditing
   */
  @Column({ type: 'varchar', length: 20 })
  tokenType: 'access' | 'refresh';

  /**
   * User ID associated with this token
   * Useful for bulk revocation (e.g., on password change)
   */
  @Column({ nullable: true })
  userId: number;

  /**
   * Original expiration time of the token
   * Used for automatic cleanup of expired blacklist entries
   */
  @Column({ type: 'timestamp' })
  expiresAt: Date;

  /**
   * Reason for blacklisting (logout, password_change, security_breach, etc.)
   * Useful for auditing and debugging
   */
  @Column({ type: 'varchar', length: 50, nullable: true })
  reason: string;

  /**
   * When this token was blacklisted
   */
  @CreateDateColumn()
  blacklistedAt: Date;
}
