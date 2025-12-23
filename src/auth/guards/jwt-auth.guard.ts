import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { TokenBlacklistService } from '../services/token-blacklist.service';

/**
 * JWT Authentication Guard
 * 
 * Extends Passport's AuthGuard to add:
 * - Token blacklist checking
 * - Better error handling
 * - Request context attachment
 * 
 * Why extend AuthGuard:
 * - Reuses Passport's token extraction and validation
 * - Adds custom security checks (blacklist)
 * - Provides consistent error responses
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
    private tokenBlacklistService: TokenBlacklistService,
  ) {
    super();
  }

  /**
   * Override canActivate to add blacklist checking
   * 
   * Flow:
   * 1. Extract token from request
   * 2. Check if token is blacklisted
   * 3. If not blacklisted, proceed with Passport validation
   * 4. If blacklisted, reject immediately
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // First, try to get the token from the request
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (token) {
      // Check blacklist before proceeding with Passport validation
      const isBlacklisted = await this.tokenBlacklistService.isTokenBlacklisted(
        token,
      );

      if (isBlacklisted) {
        throw new UnauthorizedException('Token has been revoked');
      }
    }

    // Proceed with Passport's default validation
    return super.canActivate(context) as Promise<boolean>;
  }

  /**
   * Handle authentication errors
   */
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);

      if (info?.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Access token has expired');
      }

      if (info?.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid access token');
      }

      throw err || new UnauthorizedException('Authentication failed');
    }

    return user;
  }

  /**
   * Extract JWT token from Authorization header
   */
  private extractTokenFromHeader(request: any): string | null {
    const authHeader = request.headers?.authorization;
    if (!authHeader) {
      return null;
    }

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) {
      return null;
    }

    return token;
  }
}

