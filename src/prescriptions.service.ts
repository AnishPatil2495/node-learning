import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreatePrescriptionDto } from './create-prescription.dto';
import { Prescription } from './prescription.entity';

@Injectable()
export class PrescriptionsService {
  private readonly prescriptions: Prescription[] = [];
  private nextId = 1;

  constructor(private eventEmitter: EventEmitter2) {}

  create(
    createPrescriptionDto: CreatePrescriptionDto,
    doctorId: number,
  ): Prescription {
    const newPrescription: Prescription = {
      id: this.nextId++,
      ...createPrescriptionDto,
      doctorId,
      createdAt: new Date(),
      refillDueDate: new Date(new Date().setDate(new Date().getDate() + 30)), // Assume 30-day supply
      pharmacyNotified: false,
    };
    this.prescriptions.push(newPrescription);
    this.eventEmitter.emit('prescription.created', newPrescription);
    return newPrescription;
  }

  findAllForPatient(patientId: number): Prescription[] {
    return this.prescriptions.filter((p) => p.patientId === patientId);
  }

  findOne(id: number): Prescription {
    const prescription = this.prescriptions.find((p) => p.id === id);
    if (!prescription) {
      throw new NotFoundException(`Prescription with ID #${id} not found`);
    }
    return prescription;
  }
}
