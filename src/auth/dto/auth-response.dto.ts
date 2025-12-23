/**
 * Authentication Response DTO
 * 
 * Standardized response format for authentication endpoints.
 * Never includes sensitive information like passwords or raw tokens.
 */
export class AuthResponseDto {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number; // seconds until access token expires
  tokenType: string; // Always 'Bearer'
  user?: {
    id: number;
    email: string;
    role: string;
    permissions?: string[];
  };
}

