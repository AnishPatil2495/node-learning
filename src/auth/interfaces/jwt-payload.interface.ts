/**
 * JWT Payload Interface
 * 
 * Defines the structure of the JWT token payload.
 * This ensures type safety and consistency across the application.
 * 
 * Following JWT standard claims:
 * - sub: Subject (user ID)
 * - iat: Issued at
 * - exp: Expiration
 * - iss: Issuer
 * - aud: Audience
 * 
 * Custom claims:
 * - role: User's role
 * - permissions: Array of user permissions
 * - email: User's email (for convenience, not security)
 */
export interface JwtPayload {
  sub: number; // User ID
  email: string;
  role: string;
  permissions: string[];
  iat?: number; // Issued at
  exp?: number; // Expiration
  iss?: string; // Issuer
  aud?: string; // Audience
  type?: 'access' | 'refresh'; // Token type
}

