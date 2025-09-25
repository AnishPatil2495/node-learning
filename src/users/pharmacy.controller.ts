import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PharmacyService } from '../pharmacy/pharmacy.service';
import { Prescription } from '../prescriptions/prescriptions.entity';
import { Pharmacy } from '../pharmacy/pharmacy.entity';

@Controller('pharmacy')
export class PharmacyController {
  constructor(private readonly pharmacyService: PharmacyService) {}

  @Post('notify')
  async notifyPharmacy(
    @Body() body: { prescription: Prescription; pharmacy: Pharmacy },
  ): Promise<void> {
    return this.pharmacyService.notifyPharmacy(
      body.prescription,
      body.pharmacy,
    );
  }

  @Post('refill')
  async trackRefill(
    @Body()
    body: {
      prescriptionId: string;
      quantity: number;
      refillDate: Date;
    },
  ): Promise<void> {
    return this.pharmacyService.trackRefill(
      body.prescriptionId,
      body.quantity,
      body.refillDate,
    );
  }

  @Get(':pharmacyId/active-prescriptions')
  async getActivePrescriptions(
    @Param('pharmacyId') pharmacyId: string,
  ): Promise<Prescription[]> {
    return this.pharmacyService.getActivePrescriptions(pharmacyId);
  }
}
