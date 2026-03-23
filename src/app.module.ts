import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { BullModule } from '@nestjs/bull';
import { redisStore } from 'cache-manager-redis-yet';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrescriptionsModule } from './prescriptions/prescriptions.module';
import { PharmacyModule } from './pharmacy/pharmacy.module';
import { NotificationsModule } from './notifications/notifications.module';
import { HistoryModule } from './history/history.module';
import { getRedisConfig } from './cache/redis.config';
import { SubscriptionModule } from './subscription/subscription.module';

@Module({
  imports: [
    // Configuration module for environment variables
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available globally
      envFilePath: '.env', // Optional: specify .env file path
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbType = configService.get<string>('DB_TYPE') || 'sqlite';
        
        // PostgreSQL configuration
        if (dbType === 'postgres') {
          return {
            type: 'postgres',
            host: configService.get<string>('DB_HOST') || 'localhost',
            port: configService.get<number>('DB_PORT') || 5432,
            username: configService.get<string>('DB_USERNAME') || 'postgres',
            password: configService.get<string>('DB_PASSWORD') || 'postgres',
            database: configService.get<string>('DB_NAME') || 'prescription_db',
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: configService.get<string>('NODE_ENV') !== 'production', // Auto-sync in dev only
            ssl: configService.get<string>('DB_SSL') === 'true' ? {
              rejectUnauthorized: false,
            } : false,
            logging: configService.get<string>('NODE_ENV') === 'development',
          };
        }
        
        // SQLite configuration (default/fallback)
        return {
          type: 'sqlite',
          database: configService.get<string>('DB_DATABASE') || 'db.sqlite',
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: configService.get<string>('NODE_ENV') !== 'production', // Auto-sync in dev only
        };
      },
    }),
    // Global Redis cache configuration
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const redis = getRedisConfig(configService, 'REDIS_DB');

        return {
          store: await redisStore({
            socket: {
              host: redis.host,
              port: redis.port,
            },
            password: redis.password,
            database: redis.db,
          }),
          // Default TTL in milliseconds (e.g., 60 seconds)
          ttl: 60_000,
        };
      },
    }),
    // Bull (job queue) Redis configuration
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const redis = getRedisConfig(configService, 'BULL_REDIS_DB');

        return {
          redis: {
            host: redis.host,
            port: redis.port,
            password: redis.password,
            db: redis.db,
          },
        };
      },
    }),
    AuthModule,
    UsersModule,
    PrescriptionsModule,
    PharmacyModule,
    NotificationsModule,
    HistoryModule,
    SubscriptionModule,
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
