import { IsNotEmpty, IsString } from 'class-validator';

/**
 * Refresh Token DTO
 * 
 * Validates refresh token request. The refresh token can be sent in:
 * - Request body (for API clients)
 * - HTTP-only cookie (for web browsers - more secure)
 */
export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty({ message: 'Refresh token is required' })
  refreshToken?: string;
}

