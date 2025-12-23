import { Injectable, Logger } from '@nestjs/common';

/**
 * Authentication Audit Service
 * 
 * Logs authentication events for security auditing and monitoring.
 * 
 * Logs:
 * - Login attempts (success/failure)
 * - Token refresh events
 * - Logout events
 * - Authorization failures
 * - Suspicious activity (multiple failures)
 * 
 * Why separate service:
 * - Centralized logging logic
 * - Easy to extend with external logging services (Splunk, CloudWatch, etc.)
 * - Can be enhanced to store logs in database for compliance
 * 
 * Security considerations:
 * - Never logs raw tokens or passwords
 * - Logs user IDs and emails (for auditing)
 * - Includes timestamps and IP addresses
 * - Can be extended to detect brute force attacks
 */
@Injectable()
export class AuthAuditService {
  private readonly logger = new Logger(AuthAuditService.name);

  /**
   * Log successful login
   */
  logLoginSuccess(userId: number, email: string, ipAddress?: string): void {
    this.logger.log(
      `[AUDIT] Login success - User ID: ${userId}, Email: ${email}, IP: ${ipAddress || 'unknown'}`,
    );
    
    // In production, you might want to:
    // - Store in database for compliance
    // - Send to external logging service
    // - Update user's last login timestamp
  }

  /**
   * Log failed login attempt
   */
  logLoginFailure(email: string, reason: string, ipAddress?: string): void {
    this.logger.warn(
      `[AUDIT] Login failure - Email: ${email}, Reason: ${reason}, IP: ${ipAddress || 'unknown'}`,
    );
    
    // In production, you might want to:
    // - Track failed attempts per IP/email
    // - Implement rate limiting
    // - Alert on suspicious patterns
  }

  /**
   * Log token refresh
   */
  logTokenRefresh(userId: number, email: string): void {
    this.logger.log(
      `[AUDIT] Token refresh - User ID: ${userId}, Email: ${email}`,
    );
  }

  /**
   * Log logout
   */
  logLogout(userId: number, email: string, ipAddress?: string): void {
    this.logger.log(
      `[AUDIT] Logout - User ID: ${userId}, Email: ${email}, IP: ${ipAddress || 'unknown'}`,
    );
  }

  /**
   * Log authorization failure
   */
  logAuthorizationFailure(
    userId: number,
    email: string,
    requiredRole?: string,
    requiredPermission?: string,
    resource?: string,
  ): void {
    this.logger.warn(
      `[AUDIT] Authorization failure - User ID: ${userId}, Email: ${email}, ` +
        `Required: ${requiredRole || requiredPermission || 'unknown'}, Resource: ${resource || 'unknown'}`,
    );
  }

  /**
   * Log suspicious activity
   */
  logSuspiciousActivity(
    type: string,
    details: Record<string, any>,
    ipAddress?: string,
  ): void {
    this.logger.error(
      `[AUDIT] Suspicious activity - Type: ${type}, Details: ${JSON.stringify(details)}, IP: ${ipAddress || 'unknown'}`,
    );
    
    // In production, you might want to:
    // - Send alerts to security team
    // - Block IP addresses
    // - Require additional authentication
  }

  /**
   * Log token blacklist event
   */
  logTokenBlacklist(
    userId: number,
    tokenType: 'access' | 'refresh',
    reason: string,
  ): void {
    this.logger.log(
      `[AUDIT] Token blacklisted - User ID: ${userId}, Type: ${tokenType}, Reason: ${reason}`,
    );
  }
}

