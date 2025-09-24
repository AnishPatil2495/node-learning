import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Prescription } from './prescription.entity';

@Injectable()
export class NotificationsListener {
  @OnEvent('prescription.created')
  handlePrescriptionCreatedEvent(payload: Prescription) {
    // In a real app, this would send an email, SMS, or push notification
    console.log(`Notifying pharmacy about new prescription: #${payload.id}`);
    // You could update the prescription entity here to mark it as notified
  }
}
