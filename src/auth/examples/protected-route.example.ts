/**
 * Example: Protected Routes
 * 
 * This file demonstrates how to use the authentication and authorization
 * system in your controllers.
 * 
 * DO NOT import this file - it's for reference only.
 */

import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { ResourceOwnershipGuard } from '../../common/guards/resource-ownership.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Permission } from '../../common/enums/permission.enum';
import { Role } from '../../common/enums/role.enum';

// Example 1: Simple protected route (requires authentication)
@Controller('example')
export class ExampleController {
  @Get('protected')
  @UseGuards(JwtAuthGuard)
  getProtectedData(@Request() req) {
    // req.user contains the JWT payload (set by JwtAuthGuard)
    return {
      message: 'This is protected data',
      user: req.user,
    };
  }

  // Example 2: Role-based access control
  @Get('admin-only')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  getAdminData() {
    return { message: 'Admin only data' };
  }

  // Example 3: Permission-based access control
  @Get('users')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(Permission.READ_USERS)
  getUsers() {
    return { message: 'User list' };
  }

  // Example 4: Multiple permissions (user needs ALL permissions)
  @Post('users')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(Permission.READ_USERS, Permission.WRITE_USERS)
  createUser() {
    return { message: 'User created' };
  }

  // Example 5: Combined role and permission check
  @Get('prescriptions')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(Role.Doctor, Role.Pharmacy)
  @Permissions(Permission.READ_PRESCRIPTIONS)
  getPrescriptions() {
    return { message: 'Prescriptions list' };
  }

  // Example 6: Resource ownership (users can only access their own data)
  @Get('profile/:id')
  @UseGuards(JwtAuthGuard, ResourceOwnershipGuard)
  getUserProfile(@Request() req) {
    // ResourceOwnershipGuard ensures req.params.id === req.user.sub
    // (unless user is admin/service)
    return { message: 'User profile', userId: req.params.id };
  }

  // Example 7: Complex scenario - Doctor can access patient data
  @Get('patient/:id/prescriptions')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(Role.Doctor, Role.ADMIN)
  @Permissions(Permission.READ_PRESCRIPTIONS)
  getPatientPrescriptions(@Request() req) {
    // Additional logic: Check if doctor has access to this patient
    // This would be implemented in the service layer
    return { message: 'Patient prescriptions' };
  }
}

/**
 * Usage Notes:
 * 
 * 1. Guards are executed in order:
 *    - JwtAuthGuard: Validates token and sets req.user
 *    - RolesGuard: Checks user role
 *    - PermissionsGuard: Checks user permissions
 *    - ResourceOwnershipGuard: Checks resource ownership
 * 
 * 2. Decorators can be combined:
 *    - @Roles() and @Permissions() can be used together
 *    - User must satisfy ALL requirements
 * 
 * 3. Error responses:
 *    - 401 Unauthorized: Invalid/missing token
 *    - 403 Forbidden: Valid token but insufficient permissions
 * 
 * 4. Request object:
 *    - req.user: JWT payload (JwtPayload interface)
 *    - req.user.sub: User ID
 *    - req.user.role: User role
 *    - req.user.permissions: User permissions array
 */

