import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrescriptionsModule } from './prescriptions.module';
import { NotificationsModule } from './notifications.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    PrescriptionsModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
