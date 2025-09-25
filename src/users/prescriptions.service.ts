import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prescription } from './prescriptions.entity';
import { CreatePrescriptionDto } from './create-prescription.dto';
import { UpdatePrescriptionDto } from './update-prescription.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class PrescriptionsService {
  constructor(
    @InjectRepository(Prescription)
    private prescriptionsRepository: Repository<Prescription>,
    private notificationsService: NotificationsService,
  ) {}

  async create(
    createPrescriptionDto: CreatePrescriptionDto,
  ): Promise<Prescription> {
    const prescription = this.prescriptionsRepository.create({
      ...createPrescriptionDto,
      doctor: { id: createPrescriptionDto.doctorId },
      patient: { id: createPrescriptionDto.patientId },
    });
    const savedPrescription =
      await this.prescriptionsRepository.save(prescription);
    await this.notificationsService.sendNotification(
      `patient-${savedPrescription.patient.id}`,
      `You have a new prescription from Dr. ${savedPrescription.doctor.lastName}`,
    );
    return savedPrescription;
  }

  async findOne(id: number): Promise<Prescription> {
    const prescription = await this.prescriptionsRepository.findOne({
      where: { id },
    });
    if (!prescription) {
      throw new NotFoundException(`Prescription with ID ${id} not found`);
    }
    return prescription;
  }

  async update(
    id: number,
    updatePrescriptionDto: UpdatePrescriptionDto,
  ): Promise<Prescription> {
    const prescription = await this.findOne(id);
    this.prescriptionsRepository.merge(prescription, updatePrescriptionDto);
    return this.prescriptionsRepository.save(prescription);
  }

  async remove(id: number): Promise<void> {
    const result = await this.prescriptionsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Prescription with ID ${id} not found`);
    }
  }

  async getPrescriptionHistory(patientId: number): Promise<Prescription[]> {
    return this.prescriptionsRepository.find({
      where: { patient: { id: patientId } },
    });
  }
}
