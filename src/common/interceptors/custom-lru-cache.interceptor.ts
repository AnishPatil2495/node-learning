import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import type { Cache } from 'cache-manager';

@Injectable()
export class CustomLruCacheInterceptor implements NestInterceptor {
  private readonly MAX_ENTRIES = 10;

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    // Only cache GET requests
    if (request.method !== 'GET') {
      return next.handle();
    }

    const endpointClass = context.getClass().name;
    const endpointHandler = context.getHandler().name;
    // Generate unique key based on URL
    const cacheKey = `custom_lru:${endpointClass}:${endpointHandler}:${request.url}`;
    const listKey = `custom_lru_keys:${endpointClass}:${endpointHandler}`;

    const cachedResponse = await this.cacheManager.get(cacheKey);
    if (cachedResponse) {
      return of(cachedResponse);
    }

    return next.handle().pipe(
      tap(async (response) => {
        // Cache the response
        await this.cacheManager.set(cacheKey, response, 60_000);

        try {
          // Attempt to use underlying redis client for list operations
          const store = (this.cacheManager as any).store;
          const client = store?.client;
          
          if (client && typeof client.lpush === 'function') {
            await client.lpush(listKey, cacheKey);
            
            const length = await client.llen(listKey);
            if (length > this.MAX_ENTRIES) {
              const keysToRemove = await client.lrange(
                listKey,
                this.MAX_ENTRIES,
                -1,
              );
              if (keysToRemove && keysToRemove.length > 0) {
                // Delete from cache
                for (const key of keysToRemove) {
                  await this.cacheManager.del(key);
                }
              }
              // Trim list to keep only the newest 10 keys
              await client.ltrim(listKey, 0, this.MAX_ENTRIES - 1);
            }
          }
        } catch (error) {
          console.error('LRU Cache trimming failed:', error);
        }
      }),
    );
  }
}
