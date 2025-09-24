export class Prescription {
  id: number;
  patientId: number;
  doctorId: number;
  medication: string;
  quantity: number;
  refillsRemaining: number;
  refillDueDate: Date;
  createdAt: Date;
  pharmacyNotified: boolean;
}
