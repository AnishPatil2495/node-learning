import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { History } from './history.entity';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(History)
    private historyRepository: Repository<History>,
  ) {}

  async findAll(): Promise<History[]> {
    return this.historyRepository.find();
  }

  async findByPatientId(patientId: number): Promise<History[]> {
    return this.historyRepository.find({
      where: { patient: { id: patientId } },
    });
  }

  async create(historyData: Partial<History>): Promise<History> {
    const history = this.historyRepository.create(historyData);
    return this.historyRepository.save(history);
  }

  async delete(id: number): Promise<void> {
    await this.historyRepository.delete(id);
  }
}
