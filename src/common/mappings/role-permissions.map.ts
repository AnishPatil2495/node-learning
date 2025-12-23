import { Role } from '../enums/role.enum';
import { Permission } from '../enums/permission.enum';

/**
 * Role-Permission Mapping
 * 
 * Maps roles to their default permissions. This provides a clean separation
 * between roles (who you are) and permissions (what you can do).
 * 
 * Why this approach:
 * - Centralized permission management
 * - Easy to audit what each role can do
 * - Supports permission inheritance
 * - Can be extended to support custom role-permission mappings in DB
 */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.ADMIN]: [
    // Admins have all permissions
    ...Object.values(Permission),
  ],

  [Role.SERVICE]: [
    // Service accounts can read/write most resources for automation
    Permission.READ_PRESCRIPTIONS,
    Permission.WRITE_PRESCRIPTIONS,
    Permission.READ_PHARMACY,
    Permission.WRITE_PHARMACY,
    Permission.READ_NOTIFICATIONS,
    Permission.WRITE_NOTIFICATIONS,
  ],

  [Role.USER]: [
    // Basic user permissions
    Permission.READ_PRESCRIPTIONS,
    Permission.READ_HISTORY,
    Permission.READ_NOTIFICATIONS,
  ],

  [Role.Doctor]: [
    // Doctors can manage prescriptions and read patient data
    Permission.READ_USERS,
    Permission.READ_PRESCRIPTIONS,
    Permission.WRITE_PRESCRIPTIONS,
    Permission.READ_HISTORY,
    Permission.WRITE_HISTORY,
    Permission.READ_NOTIFICATIONS,
    Permission.WRITE_NOTIFICATIONS,
  ],

  [Role.Patient]: [
    // Patients can view their own prescriptions and history
    Permission.READ_PRESCRIPTIONS,
    Permission.READ_HISTORY,
    Permission.READ_NOTIFICATIONS,
  ],

  [Role.Pharmacy]: [
    // Pharmacies can read prescriptions and update status
    Permission.READ_PRESCRIPTIONS,
    Permission.WRITE_PRESCRIPTIONS,
    Permission.READ_NOTIFICATIONS,
    Permission.WRITE_NOTIFICATIONS,
  ],
};

/**
 * Get permissions for a role
 */
export function getPermissionsForRole(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

/**
 * Check if a role has a specific permission
 */
export function roleHasPermission(role: Role, permission: Permission): boolean {
  const permissions = getPermissionsForRole(role);
  return permissions.includes(permission);
}

