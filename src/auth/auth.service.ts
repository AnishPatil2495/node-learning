import {
  Injectable,
  UnauthorizedException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { User } from '../users/users.entity';
import { TokenBlacklistService } from './services/token-blacklist.service';
import { AuthAuditService } from './services/auth-audit.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { getPermissionsForRole } from '../common/mappings/role-permissions.map';
import {
  generateSecureToken,
  getExpirationTimestamp,
} from './utils/token.util';

/**
 * Authentication Service
 *
 * Core service responsible for:
 * - User authentication (login)
 * - Token generation and management
 * - Token refresh
 * - Token blacklisting
 * - Password hashing and verification
 * - Machine-to-machine authentication
 *
 * Security considerations:
 * - Passwords are hashed using bcrypt (industry standard)
 * - Tokens are short-lived (access) and long-lived (refresh)
 * - Refresh tokens are rotated on every use
 * - All tokens can be blacklisted for immediate revocation
 */
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  // Token expiration times (in seconds)
  private readonly ACCESS_TOKEN_EXPIRES_IN = 15 * 60; // 15 minutes
  private readonly REFRESH_TOKEN_EXPIRES_IN = 7 * 24 * 60 * 60; // 7 days

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private tokenBlacklistService: TokenBlacklistService,
    private authAuditService: AuthAuditService,
  ) {}

  /**
   * Validate user credentials
   *
   * Compares provided password with hashed password in database.
   * Uses bcrypt.compare for constant-time comparison to prevent timing attacks.
   */
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByUsername(email);

    if (!user) {
      // Log failed login attempt (but don't reveal if user exists)
      this.logger.warn(`Failed login attempt for email: ${email}`);
      this.authAuditService.logLoginFailure(email, 'User not found');
      return null;
    }

    // Check if user is active
    if (!user.isActive) {
      this.logger.warn(`Login attempt for inactive user: ${email}`);
      this.authAuditService.logLoginFailure(email, 'User account inactive');
      return null;
    }

    // Verify password using bcrypt
    // Note: If password is not hashed yet (legacy data), this will fail
    // In production, you'd want a migration strategy for this
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      this.logger.warn(`Invalid password for user: ${email}`);
      this.authAuditService.logLoginFailure(email, 'Invalid password');
      return null;
    }

    this.logger.log(`Successful login for user: ${email}`);
    this.authAuditService.logLoginSuccess(user.id, user.email);
    return user;
  }

  /**
   * Generate access and refresh tokens for a user
   *
   * Creates a two-token system:
   * - Access token: Short-lived, used for API requests
   * - Refresh token: Long-lived, used to get new access tokens
   *
   * Why two tokens:
   * - Access tokens can be short-lived (better security)
   * - Refresh tokens allow seamless user experience
   * - Refresh tokens can be revoked independently
   */
  async generateTokens(user: User): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }> {
    const permissions = getPermissionsForRole(user.role as any);

    // Access token payload
    const accessTokenPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      permissions,
      type: 'access',
    };

    // Refresh token payload (minimal, just user ID)
    const refreshTokenPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      permissions,
      type: 'refresh',
    };

    // Generate tokens
    const accessToken = this.jwtService.sign(accessTokenPayload, {
      expiresIn: this.ACCESS_TOKEN_EXPIRES_IN,
    });

    const refreshToken = this.jwtService.sign(refreshTokenPayload, {
      expiresIn: this.REFRESH_TOKEN_EXPIRES_IN,
    });

    this.logger.log(`Generated tokens for user: ${user.email}`);

    return {
      accessToken,
      refreshToken,
      expiresIn: this.ACCESS_TOKEN_EXPIRES_IN,
    };
  }

  /**
   * Login user and return tokens
   */
  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user);

    // Log successful login
    this.logger.log(`User logged in: ${user.email} (ID: ${user.id})`);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: tokens.expiresIn,
      tokenType: 'Bearer',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        permissions: getPermissionsForRole(user.role as any),
      },
    };
  }

  /**
   * Refresh access token using refresh token
   *
   * Token rotation: Old refresh token is blacklisted, new one is issued.
   * This prevents token reuse and improves security.
   */
  async refreshToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }> {
    try {
      // Verify refresh token
      const payload = this.jwtService.verify<JwtPayload>(refreshToken);

      // Check if token is blacklisted
      const isBlacklisted =
        await this.tokenBlacklistService.isTokenBlacklisted(refreshToken);

      if (isBlacklisted) {
        throw new UnauthorizedException('Refresh token has been revoked');
      }

      // Verify token type
      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }

      // Get user
      const user = await this.usersService.findOne(payload.sub);
      if (!user || !user.isActive) {
        throw new UnauthorizedException('User not found or inactive');
      }

      // Blacklist old refresh token (token rotation)
      const expiresAt = payload.exp
        ? new Date(payload.exp * 1000)
        : getExpirationTimestamp(this.REFRESH_TOKEN_EXPIRES_IN);

      await this.tokenBlacklistService.blacklistToken(
        refreshToken,
        'refresh',
        expiresAt,
        user.id,
        'token_rotation',
      );
      this.authAuditService.logTokenBlacklist(
        user.id,
        'refresh',
        'token_rotation',
      );

      // Generate new tokens
      const newTokens = await this.generateTokens(user);

      this.logger.log(`Token refreshed for user: ${user.email}`);
      this.authAuditService.logTokenRefresh(user.id, user.email);

      return newTokens;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error(`Token refresh failed: ${error.message}`);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Logout user by blacklisting tokens
   *
   * Blacklists both access and refresh tokens to ensure
   * they cannot be used after logout.
   */
  async logout(accessToken: string, refreshToken?: string): Promise<void> {
    try {
      // Decode tokens to get expiration (without verification, as they might be expired)
      let accessTokenPayload: JwtPayload | null = null;
      let refreshTokenPayload: JwtPayload | null = null;

      try {
        accessTokenPayload = this.jwtService.decode(accessToken) as JwtPayload;
      } catch (error) {
        this.logger.warn('Failed to decode access token during logout');
      }

      if (refreshToken) {
        try {
          refreshTokenPayload = this.jwtService.decode(
            refreshToken,
          ) as JwtPayload;
        } catch (error) {
          this.logger.warn('Failed to decode refresh token during logout');
        }
      }

      // Blacklist access token
      if (accessTokenPayload) {
        const expiresAt = accessTokenPayload.exp
          ? new Date(accessTokenPayload.exp * 1000)
          : getExpirationTimestamp(this.ACCESS_TOKEN_EXPIRES_IN);

        await this.tokenBlacklistService.blacklistToken(
          accessToken,
          'access',
          expiresAt,
          accessTokenPayload.sub,
          'logout',
        );
      }

      // Blacklist refresh token if provided
      if (refreshToken && refreshTokenPayload) {
        const expiresAt = refreshTokenPayload.exp
          ? new Date(refreshTokenPayload.exp * 1000)
          : getExpirationTimestamp(this.REFRESH_TOKEN_EXPIRES_IN);

        await this.tokenBlacklistService.blacklistToken(
          refreshToken,
          'refresh',
          expiresAt,
          refreshTokenPayload.sub,
          'logout',
        );
      }

      const userId = accessTokenPayload?.sub;
      if (userId) {
        this.logger.log(`User logged out (user ID: ${userId})`);
        // Get user email for audit log
        const user = userId ? await this.usersService.findOne(userId) : null;
        this.authAuditService.logLogout(userId, user?.email || 'unknown');
      }
    } catch (error) {
      this.logger.error(`Logout error: ${error.message}`);
      // Don't throw - logout should succeed even if blacklisting fails
    }
  }

  /**
   * Get current user from token
   */
  async getUserFromToken(token: string): Promise<User> {
    try {
      const payload = this.jwtService.verify<JwtPayload>(token);

      // Check if token is blacklisted
      const isBlacklisted =
        await this.tokenBlacklistService.isTokenBlacklisted(token);

      if (isBlacklisted) {
        throw new UnauthorizedException('Token has been revoked');
      }

      const user = await this.usersService.findOne(payload.sub);
      if (!user || !user.isActive) {
        throw new UnauthorizedException('User not found or inactive');
      }

      return user;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid token');
    }
  }

  /**
   * Hash password using bcrypt
   *
   * Used during user registration and password changes.
   * Uses salt rounds of 10 (good balance of security and performance).
   */
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Machine-to-Machine authentication
   *
   * For service-to-service communication. Uses service credentials
   * instead of user credentials.
   *
   * In production, you'd store service credentials securely (e.g., in a
   * separate table or secrets manager).
   */
  async generateM2MToken(
    serviceId: string,
    serviceSecret: string,
  ): Promise<{
    accessToken: string;
    expiresIn: number;
  }> {
    // TODO: Implement proper service credential validation
    // For now, this is a placeholder that demonstrates the pattern

    // In production, you'd:
    // 1. Look up serviceId in database
    // 2. Verify serviceSecret using bcrypt
    // 3. Check if service is active
    // 4. Generate token with 'service' role

    if (serviceId !== 'example-service' || serviceSecret !== 'example-secret') {
      throw new UnauthorizedException('Invalid service credentials');
    }

    const payload: JwtPayload = {
      sub: 0, // Service accounts might have ID 0 or special handling
      email: `service:${serviceId}`,
      role: 'service',
      permissions: getPermissionsForRole('service' as any),
      type: 'access',
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.ACCESS_TOKEN_EXPIRES_IN,
    });

    this.logger.log(`M2M token generated for service: ${serviceId}`);

    return {
      accessToken,
      expiresIn: this.ACCESS_TOKEN_EXPIRES_IN,
    };
  }

  /**
   * Validate JWT token and return payload
   */
  validateToken(token: string): JwtPayload {
    try {
      return this.jwtService.verify<JwtPayload>(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
