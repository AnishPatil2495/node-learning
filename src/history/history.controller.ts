import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { HistoryService } from './history.service';
import { History } from './history.entity';

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get(':patientId')
  async getPrescriptionHistory(
    @Param('patientId', ParseIntPipe) patientId: number,
  ): Promise<History[]> {
    return this.historyService.findByPatientId(patientId);
  }
}
