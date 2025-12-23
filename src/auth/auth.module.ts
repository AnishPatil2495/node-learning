import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { TokenBlacklistService } from './services/token-blacklist.service';
import { AuthAuditService } from './services/auth-audit.service';
import { TokenBlacklist } from './entities/token-blacklist.entity';

/**
 * Auth Module
 *
 * Central module for authentication and authorization.
 *
 * Provides:
 * - JWT-based authentication
 * - Token management and blacklisting
 * - Role and permission-based authorization
 * - Audit logging
 *
 * Configuration:
 * - JWT secret from environment (JWT_SECRET)
 * - Token expiration times
 * - Database entities for token blacklist
 */
@Module({
  imports: [
    forwardRef(() => UsersModule),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([TokenBlacklist]),
    JwtModule.registerAsync({
      // ConfigModule is global, so we don't need to import it here
      // But we still need to inject ConfigService
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'yourSecretKey',
        signOptions: {
          expiresIn: '15m', // Access token expiration
          issuer: 'prescription-management-app',
          audience: 'prescription-management-app',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
    TokenBlacklistService,
    AuthAuditService,
  ],
  exports: [AuthService, JwtAuthGuard, TokenBlacklistService, AuthAuditService],
})
export class AuthModule {}
