import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { PrescriptionsService } from './prescriptions.service';
import { CreatePrescriptionDto } from './create-prescription.dto';
import { UpdatePrescriptionDto } from './update-prescription.dto';
import { Prescription } from './prescriptions.entity';

@Controller('prescriptions')
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @Post()
  create(
    @Body() createPrescriptionDto: CreatePrescriptionDto,
  ): Promise<Prescription> {
    return this.prescriptionsService.create(createPrescriptionDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Prescription> {
    return this.prescriptionsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePrescriptionDto: UpdatePrescriptionDto,
  ): Promise<Prescription> {
    return this.prescriptionsService.update(id, updatePrescriptionDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.prescriptionsService.remove(id);
  }
}
