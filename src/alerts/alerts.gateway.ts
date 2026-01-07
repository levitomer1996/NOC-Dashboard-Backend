import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AlertsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  async handleConnection(client: Socket): Promise<void> {
    console.log('Client connected:', client.id);
  }

  async handleDisconnect(client: Socket): Promise<void> {
    console.log('Client disconnected:', client.id);
  }

  async broadcastAlert(alert: any): Promise<void> {
    this.server.emit('opsgenieAlert', alert);
  }

}
