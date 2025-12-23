/**
 * Error Response DTO
 * 
 * Standardized error response format for all authentication errors.
 * Provides consistent error structure across all endpoints.
 */
export class ErrorResponseDto {
  error: string;
  message: string;
  statusCode: number;
  timestamp?: string;
  path?: string;
}

