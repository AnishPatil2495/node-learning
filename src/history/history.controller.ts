import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { HistoryService } from './history.service';
import { History } from './history.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { Permissions } from '../common/decorators/permissions.decorator';
import { Permission } from '../common/enums/permission.enum';
import { ResourceOwnershipGuard } from '../common/guards/resource-ownership.guard';

/**
 * History Controller
 * 
 * All endpoints require authentication.
 * Users can only access their own history unless they have elevated permissions.
 */
@Controller('history')
@UseGuards(JwtAuthGuard) // All endpoints require authentication
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  /**
   * Get prescription history for a patient
   * Requires: READ_HISTORY permission
   * Resource ownership: Users can only access their own history (unless admin/service)
   */
  @Get(':patientId')
  @UseGuards(PermissionsGuard, ResourceOwnershipGuard)
  @Permissions(Permission.READ_HISTORY)
  async getPrescriptionHistory(
    @Param('patientId', ParseIntPipe) patientId: number,
  ): Promise<History[]> {
    return this.historyService.findByPatientId(patientId);
  }
}
