import { SetMetadata } from '@nestjs/common';
import { Permission } from '../enums/permission.enum';

/**
 * Permissions Decorator
 * 
 * Used to specify required permissions for a route or controller.
 * 
 * Usage:
 * @Permissions(Permission.READ_USERS, Permission.WRITE_USERS)
 * @Get('users')
 * getUsers() { ... }
 * 
 * Why decorator pattern:
 * - Clean, declarative syntax
 * - Easy to combine with other decorators
 * - Metadata is accessible to guards via Reflector
 */
export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (...permissions: Permission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);

