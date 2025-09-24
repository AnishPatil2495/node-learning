import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { PrescriptionsService } from './prescriptions.service';
import { CreatePrescriptionDto } from './create-prescription.dto';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { Role } from './roles.enum';

@Controller('prescriptions')
@UseGuards(RolesGuard)
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @Post()
  @Roles(Role.Doctor)
  create(@Body() createPrescriptionDto: CreatePrescriptionDto) {
    // In a real app, the doctor's ID would come from the authenticated user
    const mockDoctorId = 1;
    return this.prescriptionsService.create(
      createPrescriptionDto,
      mockDoctorId,
    );
  }

  @Get('patient/:patientId')
  @Roles(Role.Patient, Role.Doctor)
  findAllForPatient(@Param('patientId', ParseIntPipe) patientId: number) {
    // In a real app, a patient could only access their own prescriptions.
    return this.prescriptionsService.findAllForPatient(patientId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.prescriptionsService.findOne(id);
  }
}
