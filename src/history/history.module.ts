import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { History } from './history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([History]), forwardRef(() => AuthModule)],
  controllers: [HistoryController],
  providers: [HistoryService],
})
export class HistoryModule {}
