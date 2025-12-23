import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { PharmacyService } from './pharmacy.service';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { Permissions } from '../common/decorators/permissions.decorator';
import { Permission } from '../common/enums/permission.enum';
import { Role } from '../common/enums/role.enum';
import { Prescription } from '../prescriptions/prescriptions.entity';
import { Pharmacy } from './pharmacy.entity';

/**
 * Pharmacy Controller
 * 
 * All endpoints require authentication.
 * Pharmacy-specific operations require Pharmacy role or appropriate permissions.
 */
@Controller('pharmacy')
@UseGuards(JwtAuthGuard) // All endpoints require authentication
export class PharmacyController {
  constructor(private readonly pharmacyService: PharmacyService) {}

  /**
   * Notify pharmacy about a prescription
   * Requires: Pharmacy role or WRITE_NOTIFICATIONS permission
   */
  @Post('notify')
  @UseGuards(RolesGuard, PermissionsGuard)
  @Roles(Role.Pharmacy, Role.ADMIN)
  @Permissions(Permission.WRITE_NOTIFICATIONS)
  async notifyPharmacy(
    @Body() body: { prescription: Prescription; pharmacy: Pharmacy },
  ): Promise<void> {
    return this.pharmacyService.notifyPharmacy(
      body.prescription,
      body.pharmacy,
    );
  }

  /**
   * Track prescription refill
   * Requires: Pharmacy role or WRITE_PRESCRIPTIONS permission
   */
  @Post('refill')
  @UseGuards(RolesGuard, PermissionsGuard)
  @Roles(Role.Pharmacy, Role.ADMIN)
  @Permissions(Permission.WRITE_PRESCRIPTIONS)
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

  /**
   * Get active prescriptions for a pharmacy
   * Requires: Pharmacy role or READ_PRESCRIPTIONS permission
   */
  @Get(':pharmacyId/active-prescriptions')
  @UseGuards(RolesGuard, PermissionsGuard)
  @Roles(Role.Pharmacy, Role.ADMIN)
  @Permissions(Permission.READ_PRESCRIPTIONS)
  async getActivePrescriptions(
    @Param('pharmacyId') pharmacyId: string,
  ): Promise<Prescription[]> {
    return this.pharmacyService.getActivePrescriptions(pharmacyId);
  }
}
