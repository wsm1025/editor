import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { ChatRoomService } from './chat-room.service';
import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

@WebSocketGateway(4000, {
  namespace: 'chat-room',
  cors: {
    origin: '*',
  },
})
export class ChatRoomGateway {
  constructor(private readonly chatRoomService: ChatRoomService) {}
  // socket 服务器
  @WebSocketServer()
  server: Server;
  rooms = new Map();

  @SubscribeMessage('joinRoom')
  create(@MessageBody() userInfo, @ConnectedSocket() client: Socket) {
    if (this.rooms.has(userInfo.userId)) {
      return;
    }
    this.rooms.set(userInfo.userId, client.id);
    this.server.emit('userJoinRoom', {
      message: {
        userId: userInfo.userId,
        userName: userInfo.userName,
        type: 'notice',
        content: `欢迎${userInfo.userName}加入聊天室`,
        time: new Date().toLocaleString(),
        msgId: uuidv4(),
      },
    });
    console.log(this.rooms);
  }
  @SubscribeMessage('sendMessage')
  sendMessage(@MessageBody() info) {
    this.server.emit('getMessage', {
      message: {
        userId: info.userId,
        userName: info.userName,
        type: info.type,
        content: info.content,
        time: new Date().toLocaleString(),
        msgId: uuidv4(),
      },
    });
  }
}
