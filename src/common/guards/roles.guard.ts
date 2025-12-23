import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';

/**
 * Roles Guard
 * 
 * Checks if the authenticated user has one of the required roles.
 * 
 * Why separate from PermissionsGuard:
 * - Roles are simpler and faster to check
 * - Some routes only need role-based access
 * - Can be combined with PermissionsGuard for complex scenarios
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }
    
    const request = context.switchToHttp().getRequest();
    const user: JwtPayload = request.user;
    
    if (!user || !user.role) {
      throw new ForbiddenException('User not authenticated or role missing');
    }
    
    const hasRole = requiredRoles.some((role) => user.role === role);
    
    if (!hasRole) {
      throw new ForbiddenException(
        `Access denied. Required roles: ${requiredRoles.join(', ')}`,
      );
    }
    
    return true;
  }
}
