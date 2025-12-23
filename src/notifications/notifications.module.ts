import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsProcessor } from './notifications.processor';

@Module({
  imports: [
    // Register notifications queue
    BullModule.registerQueue({
      name: 'notifications',
    }),
  ],
  providers: [NotificationsService, NotificationsGateway, NotificationsProcessor],
  exports: [NotificationsService],
})
export class NotificationsModule {}