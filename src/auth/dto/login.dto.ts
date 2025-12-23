import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

/**
 * Login DTO
 * 
 * Validates login request payload to ensure security and data integrity.
 * Using class-validator for automatic validation in NestJS.
 */
export class LoginDto {
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
}

