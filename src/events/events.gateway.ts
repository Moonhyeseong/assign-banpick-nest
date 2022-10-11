import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Model } from 'mongoose';
import { Game } from 'src/game/schema/game.schema';
import { User } from 'src/user/schema/user.shcema';
import { ROLEDATA } from 'src/game/constdata';

@Injectable()
@WebSocketGateway({ transports: ['websocket'] })
export class EventsGateway {
  constructor(
    @InjectModel(Game.name) private readonly gameModel: Model<Game>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('socket-conncet')
  async initSocketConnection(@MessageBody() data: string) {
    this.server.emit('ServerToClient', data);
  }

  @SubscribeMessage('disconnect')
  disconncet() {
    this.server.disconnectSockets();
  }

  @SubscribeMessage('createGame')
  handleCreateGame() {
    this.server.emit('updateGameList');
  }

  @SubscribeMessage('userJoin')
  handleUserJoin(@MessageBody() gameId: string) {
    this.server.emit('updateGameData', gameId);
    this.server.emit('updateGameList');
  }

  @SubscribeMessage('userReadyEvent')
  async handleUserReadyEvent(@MessageBody() data) {
    const gameId = data.gameId;
    const userId = data.userId;

    //단일 게임 데이터 업데이트
    this.gameModel.findById({ _id: gameId }, (err, result) => {
      if (err) throw err;
      const getUpdatedUserList = () => {
        const updatedUserList = result.userList;

        updatedUserList[data.side][ROLEDATA[data.role]] = {
          ...updatedUserList[data.side][ROLEDATA[data.role]],
          isReady: true,
        };
        return updatedUserList;
      };

      this.gameModel.findByIdAndUpdate(
        { _id: gameId },
        { userList: getUpdatedUserList() },
        { new: true },
        (err) => {
          if (err) throw err;
        },
      );
    });
    //유저 데이터 업데이트
    this.userModel.findOneAndUpdate(
      { userId: userId },
      { isReady: true },
      { new: true },
      (err) => {
        if (err) throw err;
      },
    );

    this.server.emit('updateGameData', gameId);
  }
}