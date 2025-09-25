import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { PharmacyService } from './pharmacy.service';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Prescription } from '../prescriptions/prescriptions.entity';
import { Pharmacy } from './pharmacy.entity';

@Controller('pharmacy')
@UseGuards(RolesGuard)
export class PharmacyController {
  constructor(private readonly pharmacyService: PharmacyService) {}

  @Post('notify')
  @Roles('Pharmacy')
  async notifyPharmacy(
    @Body() body: { prescription: Prescription; pharmacy: Pharmacy },
  ): Promise<void> {
    return this.pharmacyService.notifyPharmacy(
      body.prescription,
      body.pharmacy,
    );
  }

  @Post('refill')
  @Roles('Pharmacy')
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
  @Roles('Pharmacy')
  async getActivePrescriptions(
    @Param('pharmacyId') pharmacyId: string,
  ): Promise<Prescription[]> {
    return this.pharmacyService.getActivePrescriptions(pharmacyId);
  }
}
