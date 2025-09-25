import { Injectable } from '@nestjs/common';
import { NotificationsService } from '../notifications/notifications.service';
import { Prescription } from '../prescriptions/prescriptions.entity';
import { Pharmacy } from './pharmacy.entity';

@Injectable()
export class PharmacyService {
  constructor(private readonly notificationsService: NotificationsService) {}

  async notifyPharmacy(
    prescription: Prescription,
    pharmacy: Pharmacy,
  ): Promise<void> {
    const message = `New prescription for patient #${prescription.patient.id}: ${prescription.medication}`;
    await this.notificationsService.sendNotification(
      `pharmacy-${pharmacy.id}`,
      message,
    );
  }

  async trackRefill(
    prescriptionId: string,
    quantity: number,
    refillDate: Date,
  ): Promise<void> {
    // Logic to track refill dates and quantities
  }

  async getActivePrescriptions(pharmacyId: string): Promise<Prescription[]> {
    // Logic to retrieve active prescriptions for a specific pharmacy
    return [];
  }
}
