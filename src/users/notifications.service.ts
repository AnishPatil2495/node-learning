import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class NotificationsService {
  public server: Server;

  async sendNotification(channel: string, message: string) {
    if (this.server) {
      this.server.emit(channel, { message });
    }
  }
}
