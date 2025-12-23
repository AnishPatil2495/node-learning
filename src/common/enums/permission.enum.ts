/**
 * Permission Enum
 * 
 * Defines granular permissions that can be assigned to roles or users.
 * Permissions provide fine-grained access control beyond just roles.
 * 
 * Why separate permissions from roles:
 * - Allows flexible permission assignment
 * - Supports permission overrides for specific users
 * - Enables future multi-tenant permission models
 * - Makes it easier to audit what actions users can perform
 */
export enum Permission {
  // Read permissions
  READ_USERS = 'read:users',
  READ_PRESCRIPTIONS = 'read:prescriptions',
  READ_PHARMACY = 'read:pharmacy',
  READ_HISTORY = 'read:history',
  READ_NOTIFICATIONS = 'read:notifications',

  // Write permissions
  WRITE_USERS = 'write:users',
  WRITE_PRESCRIPTIONS = 'write:prescriptions',
  WRITE_PHARMACY = 'write:pharmacy',
  WRITE_HISTORY = 'write:history',
  WRITE_NOTIFICATIONS = 'write:notifications',

  // Delete permissions
  DELETE_USERS = 'delete:users',
  DELETE_PRESCRIPTIONS = 'delete:prescriptions',
  DELETE_PHARMACY = 'delete:pharmacy',
  DELETE_HISTORY = 'delete:history',
  DELETE_NOTIFICATIONS = 'delete:notifications',

  // Admin permissions
  MANAGE_SYSTEM = 'manage:system',
  MANAGE_ROLES = 'manage:roles',
  MANAGE_PERMISSIONS = 'manage:permissions',
}

