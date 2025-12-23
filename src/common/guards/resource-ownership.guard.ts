import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';
import { Role } from '../enums/role.enum';

/**
 * Resource Ownership Guard
 * 
 * Ensures users can only access their own resources unless they have
 * elevated permissions (admin, etc.).
 * 
 * Usage:
 * - Apply to routes that access user-specific data
 * - Automatically checks if resource belongs to requesting user
 * - Admins and service accounts bypass ownership checks
 * 
 * Why this guard:
 * - Prevents users from accessing other users' data
 * - Enforces principle of least privilege
 * - Can be extended to support resource-level permissions
 */
@Injectable()
export class ResourceOwnershipGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user: JwtPayload = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Admins and service accounts can access any resource
    if (user.role === Role.ADMIN || user.role === Role.SERVICE) {
      return true;
    }

    // Get resource ID from route params or body
    const resourceUserId = this.getResourceUserId(request);

    if (!resourceUserId) {
      // If no resource ID specified, allow (might be a list endpoint)
      return true;
    }

    // Check if resource belongs to user
    if (resourceUserId !== user.sub) {
      throw new ForbiddenException(
        'Access denied. You can only access your own resources.',
      );
    }

    return true;
  }

  /**
   * Extract user ID from resource
   * 
   * Checks common locations:
   * - Route params (e.g., /users/:id)
   * - Request body (e.g., { userId: ... })
   * - Query params (e.g., ?userId=...)
   */
  private getResourceUserId(request: any): number | null {
    // Check route params first (most common)
    if (request.params?.id) {
      return parseInt(request.params.id, 10);
    }

    if (request.params?.userId) {
      return parseInt(request.params.userId, 10);
    }

    // Check request body
    if (request.body?.userId) {
      return parseInt(request.body.userId, 10);
    }

    // Check query params
    if (request.query?.userId) {
      return parseInt(request.query.userId, 10);
    }

    return null;
  }
}

