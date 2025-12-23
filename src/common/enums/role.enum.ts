/**
 * Role Enum
 * 
 * Defines user roles in the system. Roles are hierarchical and map to sets of permissions.
 * 
 * Role hierarchy (from most to least privileged):
 * - admin: Full system access
 * - service: Machine-to-machine service accounts
 * - Doctor: Healthcare provider role (maps to user with elevated permissions)
 * - Pharmacy: Pharmacy service role
 * - Patient: Standard user role (maps to user)
 * - user: Basic authenticated user
 * 
 * Why these roles:
 * - admin: System administrators need full control
 * - service: M2M authentication for internal services
 * - user: Base role for authenticated users
 * - Doctor/Patient/Pharmacy: Domain-specific roles for the prescription management system
 */
export enum Role {
  ADMIN = 'admin',
  USER = 'user',
  SERVICE = 'service',
  // Domain-specific roles (maintained for backward compatibility)
  Doctor = 'Doctor',
  Patient = 'Patient',
  Pharmacy = 'Pharmacy',
}