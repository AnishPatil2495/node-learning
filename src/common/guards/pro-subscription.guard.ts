import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class ProSubscriptionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Assuming user is populated by JwtAuthGuard before this guard runs
    if (!user || !user.isPro) {
      throw new ForbiddenException('This feature requires a Pro subscription.');
    }

    return true;
  }
}
