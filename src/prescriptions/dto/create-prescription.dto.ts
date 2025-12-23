import { IsString, IsInt, IsNotEmpty } from 'class-validator';

export class CreatePrescriptionDto {
  @IsInt()
  @IsNotEmpty()
  doctorId: number;

  @IsInt()
  @IsNotEmpty()
  patientId: number;

  @IsString()
  @IsNotEmpty()
  medication: string;

  @IsString()
  @IsNotEmpty()
  dosage: string;

  @IsString()
  @IsNotEmpty()
  frequency: string;
}

