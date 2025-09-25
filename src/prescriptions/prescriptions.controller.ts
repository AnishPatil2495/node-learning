import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { PrescriptionsService } from './prescriptions.service';
import { CreatePrescriptionDto } from '../users/create-prescription.dto';
import { Prescription } from './prescriptions.entity';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('prescriptions')
@UseGuards(RolesGuard)
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @Post()
  @Roles('Doctor')
  async create(
    @Body() createPrescriptionDto: CreatePrescriptionDto,
  ): Promise<Prescription> {
    return this.prescriptionsService.create(createPrescriptionDto);
  }

  @Get('history/:patientId')
  @Roles('Patient')
  async findPrescriptionHistory(
    @Param('patientId', ParseIntPipe) patientId: number,
  ): Promise<Prescription[]> {
    return this.prescriptionsService.getPrescriptionHistory(patientId);
  }
}
