export class CreatePrescriptionDto {
  patientId: number;
  medication: string;
  quantity: number;
  refillsRemaining: number;
}
