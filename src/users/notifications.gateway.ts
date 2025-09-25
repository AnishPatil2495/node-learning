import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { NotificationsService } from './notifications.service';

@WebSocketGateway()
export class NotificationsGateway implements OnGatewayInit {
  @WebSocketServer() server: Server;

  constructor(private readonly notificationsService: NotificationsService) {}

  afterInit(server: Server) {
    this.notificationsService.server = server;
  }
}
