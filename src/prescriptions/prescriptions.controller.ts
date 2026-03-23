import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
  Patch,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { PrescriptionsService } from './prescriptions.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';
import { Prescription } from './prescriptions.entity';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { Permissions } from '../common/decorators/permissions.decorator';
import { Permission } from '../common/enums/permission.enum';
import { Role } from '../common/enums/role.enum';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { ProSubscriptionGuard } from '../common/guards/pro-subscription.guard';

/**
 * Prescriptions Controller
 * 
 * All endpoints require authentication.
 * Different endpoints have different authorization requirements.
 */
@Controller('prescriptions')
@UseGuards(JwtAuthGuard) // All endpoints require authentication
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  /**
   * Create a new prescription
   * Requires: Doctor role or WRITE_PRESCRIPTIONS permission
   */
  @Post()
  @UseGuards(RolesGuard, PermissionsGuard, ProSubscriptionGuard)
  @Roles(Role.Doctor, Role.ADMIN)
  @Permissions(Permission.WRITE_PRESCRIPTIONS)
  async create(
    @Body() createPrescriptionDto: CreatePrescriptionDto,
  ): Promise<Prescription> {
    return this.prescriptionsService.create(createPrescriptionDto);
  }

  /**
   * Get all prescriptions
   * Requires: READ_PRESCRIPTIONS permission
   */
  @Get()
  @UseGuards(PermissionsGuard)
  @Permissions(Permission.READ_PRESCRIPTIONS)
  @UseInterceptors(CacheInterceptor)
  async findAll(): Promise<Prescription[]> {
    return this.prescriptionsService.findAll();
  }

  /**
   * Get a prescription by ID
   * Requires: READ_PRESCRIPTIONS permission
   */
  @Get(':id')
  @UseGuards(PermissionsGuard)
  @Permissions(Permission.READ_PRESCRIPTIONS)
  @UseInterceptors(CacheInterceptor)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Prescription> {
    return this.prescriptionsService.findOne(id);
  }

  /**
   * Update a prescription
   * Requires: Doctor role or WRITE_PRESCRIPTIONS permission
   */
  @Patch(':id')
  @UseGuards(RolesGuard, PermissionsGuard, ProSubscriptionGuard)
  @Roles(Role.Doctor, Role.ADMIN)
  @Permissions(Permission.WRITE_PRESCRIPTIONS)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePrescriptionDto: UpdatePrescriptionDto,
  ): Promise<Prescription> {
    return this.prescriptionsService.update(id, updatePrescriptionDto);
  }

  /**
   * Delete a prescription
   * Requires: Doctor role or DELETE_PRESCRIPTIONS permission
   */
  @Delete(':id')
  @UseGuards(RolesGuard, PermissionsGuard, ProSubscriptionGuard)
  @Roles(Role.Doctor, Role.ADMIN)
  @Permissions(Permission.DELETE_PRESCRIPTIONS)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.prescriptionsService.remove(id);
  }

  /**
   * Get prescription history for a patient
   * Requires: Patient role or READ_PRESCRIPTIONS permission
   */
  @Get('history/:patientId')
  @UseGuards(RolesGuard, PermissionsGuard)
  @Roles(Role.Patient, Role.Doctor, Role.ADMIN)
  @Permissions(Permission.READ_PRESCRIPTIONS)
  @UseInterceptors(CacheInterceptor)
  async findPrescriptionHistory(
    @Param('patientId', ParseIntPipe) patientId: number,
  ): Promise<Prescription[]> {
    return this.prescriptionsService.getPrescriptionHistory(patientId);
  }
}
