import { ConfigService } from '@nestjs/config';

/**
 * Redis configuration helper
 *
 * Centralizes how we read Redis connection details from env so the same
 * settings can be reused by:
 * - Global cache (CacheModule)
 * - Bull queues
 */
export interface RedisConfigOptions {
  host: string;
  port: number;
  password?: string;
  db: number;
}

export function getRedisConfig(
  configService: ConfigService,
  dbEnvKey = 'REDIS_DB',
): RedisConfigOptions {
  const host = configService.get<string>('REDIS_HOST') || 'localhost';
  const port = Number(configService.get<string>('REDIS_PORT') || 6379);
  const password = configService.get<string>('REDIS_PASSWORD') || undefined;
  const db = Number(configService.get<string>(dbEnvKey) || 0);

  return {
    host,
    port,
    password,
    db,
  };
}


