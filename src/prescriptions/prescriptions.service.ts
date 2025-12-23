import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prescription } from './prescriptions.entity';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';

@Injectable()
export class PrescriptionsService {
  constructor(
    @InjectRepository(Prescription)
    private prescriptionsRepository: Repository<Prescription>,
    private notificationsService: NotificationsService,
    @InjectQueue('notifications')
    private readonly notificationsQueue: Queue,
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
    // Enqueue notification job instead of sending synchronously
    await this.notificationsQueue.add(
      'send',
      {
        channel: `patient-${savedPrescription.patient.id}`,
        message: `You have a new prescription from Dr. ${savedPrescription.doctor.lastName}`,
      },
      {
        attempts: 3,
        backoff: 5000,
      },
    );
    return savedPrescription;
  }

  async findAll(): Promise<Prescription[]> {
    return this.prescriptionsRepository.find();
  }

  async findOne(id: number): Promise<Prescription> {
    const prescription = await this.prescriptionsRepository.findOne({
      where: { id },
    });
    if (!prescription) {
      throw new Error(`Prescription with ID ${id} not found`);
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
      throw new Error(`Prescription with ID ${id} not found`);
    }
  }

  async getPrescriptionHistory(patientId: number): Promise<Prescription[]> {
    return this.prescriptionsRepository.find({
      where: {
        patient: { id: patientId },
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }
}
