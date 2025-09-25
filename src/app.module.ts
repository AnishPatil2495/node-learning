import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrescriptionsModule } from './prescriptions/prescriptions.module';
import { PharmacyModule } from './pharmacy/pharmacy.module';
import { NotificationsModule } from './notifications/notifications.module';
import { HistoryModule } from './history/history.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Note: Set to false in production
    }),
    AuthModule,
    UsersModule,
    PrescriptionsModule,
    PharmacyModule,
    NotificationsModule,
    HistoryModule,
  ],
})
export class AppModule {}
