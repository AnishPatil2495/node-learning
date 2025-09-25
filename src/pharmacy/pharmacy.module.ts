import { Module } from '@nestjs/common';
import { PharmacyService } from './pharmacy.service';
import { PharmacyController } from './pharmacy.controller';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  controllers: [PharmacyController],
  providers: [PharmacyService],
})
export class PharmacyModule {}