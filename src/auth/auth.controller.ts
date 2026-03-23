import {
  Controller,
  Post,
  Body,
  Get,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  Res,
  Req,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { M2MTokenDto } from './dto/m2m-token.dto';
import { SignupDto } from './dto/signup.dto';
import { Role } from '../common/enums/role.enum';
import { getPermissionsForRole } from '../common/mappings/role-permissions.map';

/**
 * Authentication Controller
 *
 * Handles all authentication-related endpoints:
 * - Login: User authentication
 * - Logout: Token revocation
 * - Refresh: Token refresh with rotation
 * - Me: Get current user info
 * - M2M: Machine-to-machine authentication
 *
 * Security considerations:
 * - All endpoints validate input using DTOs
 * - Sensitive data is never exposed in responses
 * - Proper HTTP status codes for all scenarios
 * - Consistent error response format
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /auth/login
   *
   * Authenticates a user and returns access + refresh tokens.
   *
   * Request body:
   * - email: User's email
   * - password: User's password
   *
   * Response:
   * - accessToken: JWT access token (short-lived)
   * - refreshToken: JWT refresh token (long-lived)
   * - expiresIn: Access token expiration time in seconds
   * - tokenType: Always "Bearer"
   * - user: User information (without sensitive data)
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    try {
      const result = await this.authService.login(
        loginDto.email,
        loginDto.password,
      );

      return {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        expiresIn: result.expiresIn,
        tokenType: result.tokenType,
        user: result.user,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Login failed');
    }
  }

  /**
   * POST /auth/refresh
   *
   * Refreshes an access token using a refresh token.
   * Implements token rotation: old refresh token is blacklisted,
   * new tokens are issued.
   *
   * Request body:
   * - refreshToken: Valid refresh token
   *
   * Response:
   * - accessToken: New access token
   * - refreshToken: New refresh token (rotated)
   * - expiresIn: Access token expiration time in seconds
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    try {
      if (!refreshTokenDto.refreshToken) {
        throw new UnauthorizedException('Refresh token is required');
      }

      const result = await this.authService.refreshToken(
        refreshTokenDto.refreshToken,
      );

      return {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        expiresIn: result.expiresIn,
        tokenType: 'Bearer',
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Token refresh failed');
    }
  }

  /**
   * POST /auth/logout
   *
   * Logs out a user by blacklisting their tokens.
   *
   * Request headers:
   * - Authorization: Bearer <access_token>
   *
   * Request body (optional):
   * - refreshToken: Refresh token to also blacklist
   *
   * Response:
   * - message: Success message
   */
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req, @Body() body?: { refreshToken?: string }) {
    try {
      // Extract access token from Authorization header
      const authHeader = req.headers?.authorization;
      const accessToken = authHeader?.split(' ')[1];

      if (!accessToken) {
        throw new UnauthorizedException('Access token is required');
      }

      await this.authService.logout(accessToken, body?.refreshToken);

      return {
        message: 'Successfully logged out',
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Logout failed');
    }
  }

  /**
   * GET /auth/me
   *
   * Returns information about the currently authenticated user.
   *
   * Request headers:
   * - Authorization: Bearer <access_token>
   *
   * Response:
   * - id: User ID
   * - email: User email
   * - role: User role
   * - permissions: User permissions
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Request() req) {
    const user = req.user; // Set by JwtAuthGuard

    return {
      id: user.sub,
      email: user.email,
      role: user.role,
      permissions: user.permissions || getPermissionsForRole(user.role as any),
    };
  }

  /**
   * POST /auth/m2m/token
   *
   * Generates an access token for machine-to-machine communication.
   *
   * Request body:
   * - serviceId: Service identifier
   * - serviceSecret: Service secret
   *
   * Response:
   * - accessToken: JWT access token
   * - expiresIn: Token expiration time in seconds
   * - tokenType: Always "Bearer"
   *
   * Note: This is a placeholder implementation. In production, you'd:
   * - Store service credentials securely (database, secrets manager)
   * - Use bcrypt to hash service secrets
   * - Implement service account management
   */
  @Post('m2m/token')
  @HttpCode(HttpStatus.OK)
  async getM2MToken(@Body() m2mDto: M2MTokenDto) {
    try {
      const result = await this.authService.generateM2MToken(
        m2mDto.serviceId,
        m2mDto.serviceSecret,
      );

      return {
        accessToken: result.accessToken,
        expiresIn: result.expiresIn,
        tokenType: 'Bearer',
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('M2M authentication failed');
    }
  }

  /**
   * POST /auth/signup
   *
   * Registers a new user as a Patient (default role).
   *
   * Request body:
   * - firstName: string
   * - lastName: string
   * - email: string
   * - password: string
   *
   * Response:
   * - accessToken: JWT access token (short-lived)
   * - refreshToken: JWT refresh token (long-lived)
   * - expiresIn: Access token expiration time in seconds
   * - tokenType: Always "Bearer"
   * - user: User information (without sensitive data)
   */
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() signupDto: SignupDto) {
    try {
      const result = await this.authService.signup(signupDto);
      return {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        expiresIn: result.expiresIn,
        tokenType: result.tokenType,
        user: result.user,
      };
    } catch (error) {
      throw new UnauthorizedException(error.message || 'Signup failed');
    }
  }
}
