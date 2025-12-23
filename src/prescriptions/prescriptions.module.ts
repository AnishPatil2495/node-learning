import { forwardRef, Module } from '@nestjs/common';
import { PrescriptionsService } from './prescriptions.service';
import { PrescriptionsController } from './prescriptions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prescription } from './prescriptions.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { BullModule } from '@nestjs/bull';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Prescription]),
    // Register notifications queue in this module so InjectQueue('notifications') works
    BullModule.registerQueue({
      name: 'notifications',
    }),
    NotificationsModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [PrescriptionsController],
  providers: [PrescriptionsService],
})
export class PrescriptionsModule {}
