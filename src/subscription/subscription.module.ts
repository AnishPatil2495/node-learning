import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    BullModule.registerQueue({
      name: 'notifications',
    }),
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
})
export class SubscriptionModule {}
