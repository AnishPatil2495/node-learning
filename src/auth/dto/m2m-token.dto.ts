import { IsNotEmpty, IsString } from 'class-validator';

/**
 * Machine-to-Machine Token DTO
 * 
 * For service-to-service authentication. Uses API keys or service credentials
 * instead of user credentials.
 */
export class M2MTokenDto {
  @IsString()
  @IsNotEmpty({ message: 'Service ID is required' })
  serviceId: string;

  @IsString()
  @IsNotEmpty({ message: 'Service secret is required' })
  serviceSecret: string;
}

