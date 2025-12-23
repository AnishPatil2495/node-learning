import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

/**
 * JWT Strategy
 * 
 * Passport strategy for validating JWT tokens on protected routes.
 * This strategy:
 * - Extracts JWT from Authorization header (Bearer token)
 * - Validates token signature and expiration
 * - Checks token blacklist
 * - Attaches user payload to request object
 * 
 * Why use Passport:
 * - Industry standard for authentication in Node.js
 * - Clean separation of concerns
 * - Easy to extend with other strategies (OAuth, API keys, etc.)
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
  ) {
    super({
      // Extract JWT from Authorization header: "Bearer <token>"
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      
      // Secret key for verifying token signature
      // In production, use environment variable
      secretOrKey: configService.get<string>('JWT_SECRET') || 'yourSecretKey',
      
      // Validate token expiration
      ignoreExpiration: false,
      
      // Pass request object to validate method (useful for additional checks)
      passReqToCallback: false,
    });
  }

  /**
   * Validate method called by Passport after token is verified
   * 
   * This method:
   * - Receives the decoded JWT payload
   * - Can perform additional validation (blacklist check, user status, etc.)
   * - Returns user object that will be attached to request.user
   */
  async validate(payload: JwtPayload): Promise<JwtPayload> {
    // Additional validation can be done here:
    // - Check if user still exists and is active
    // - Check token blacklist (though this is done in guard for better performance)
    // - Verify permissions haven't changed
    
    // For now, we return the payload as-is
    // The guard will handle blacklist checking
    
    if (!payload.sub || !payload.role) {
      throw new UnauthorizedException('Invalid token payload');
    }

    return payload;
  }
}

