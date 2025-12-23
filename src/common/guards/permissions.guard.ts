import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { Permission } from '../enums/permission.enum';
import { getPermissionsForRole } from '../mappings/role-permissions.map';
import { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';

/**
 * Permissions Guard
 * 
 * Checks if the authenticated user has the required permissions.
 * 
 * Flow:
 * 1. Get required permissions from route metadata
 * 2. Get user's role from request (set by JwtAuthGuard)
 * 3. Get permissions for user's role
 * 4. Check if user has all required permissions
 * 5. Throw 403 Forbidden if permissions are missing
 * 
 * Why separate from RolesGuard:
 * - Permissions are more granular than roles
 * - Allows fine-grained access control
 * - Supports permission-based authorization
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get required permissions from route metadata
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no permissions required, allow access
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    // Get user from request (set by JwtAuthGuard)
    const request = context.switchToHttp().getRequest();
    const user: JwtPayload = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Get user's permissions
    // First check if permissions are in token payload (preferred)
    let userPermissions: Permission[] = [];
    
    if (user.permissions && user.permissions.length > 0) {
      userPermissions = user.permissions as Permission[];
    } else {
      // Fallback: get permissions from role mapping
      userPermissions = getPermissionsForRole(user.role as any);
    }

    // Check if user has all required permissions
    const hasAllPermissions = requiredPermissions.every((permission) =>
      userPermissions.includes(permission),
    );

    if (!hasAllPermissions) {
      throw new ForbiddenException(
        `Missing required permissions: ${requiredPermissions.join(', ')}`,
      );
    }

    return true;
  }
}

