import { Process, Processor } from '@nestjs/bull';
import type { Job } from 'bull';
import { NotificationsService } from './notifications.service';

interface NotificationJobData {
  channel: string;
  message: string;
}

/**
 * Notifications Processor
 *
 * Consumes jobs from the `notifications` Bull queue and delegates
 * actual delivery to `NotificationsService` (WebSocket).
 */
@Processor('notifications')
export class NotificationsProcessor {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Process('send')
  async handleSendNotification(job: Job<NotificationJobData>): Promise<void> {
    const { channel, message } = job.data;
    await this.notificationsService.sendNotification(channel, message);
  }
}


