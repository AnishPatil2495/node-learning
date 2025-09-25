import { IsString, IsInt } from 'class-validator';

export class CreatePrescriptionDto {
  @IsInt()
  doctorId: number;

  @IsInt()
  patientId: number;

  @IsString()
  medication: string;
}
