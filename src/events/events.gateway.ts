import { Server, Socket } from 'socket.io';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Game } from 'src/game/schema/game.schema';
import { User } from 'src/user/schema/user.shcema';
import { IGame } from './../game/interfaces/game.interface';
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
  async initSocketConnection(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join('lobby');
  }

  @SubscribeMessage('disconnect')
  disconncet() {
    this.server.disconnectSockets();
  }

  @SubscribeMessage('createGame')
  handleCreateGame() {
    this.server.in('lobby').emit('updateGameList');
  }

  @SubscribeMessage('userJoinGame')
  handleUserJoin(
    @MessageBody() gameId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.leave('lobby');
    client.join(gameId);
  }

  @SubscribeMessage('userJoinWatingRoom')
  handleUserJoinWatingRoom(@MessageBody() data) {
    this.server.in(data.gameId).emit('updateGameData', data.gameId);
    this.server.in('lobby').emit('updateGameList');
    this.server.in('lobby').emit('updateGameListTest', 'updateGameListTest');
  }

  @SubscribeMessage('userReadyEvent')
  async handleUserReadyEvent(@MessageBody() data) {
    const gameId = data.gameId;
    const userId = data.userId;

    //단일 게임 데이터 업데이트
    this.gameModel.findById({ _id: gameId }, (err: object, result: IGame) => {
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
          this.server.in(gameId).emit('updateGameData', gameId);
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
  }

  @SubscribeMessage('startSimulator')
  handleStartSimulator(@MessageBody() gameId: string) {
    this.gameModel.findByIdAndUpdate(
      { _id: gameId },
      { isProceeding: true },
      { new: true },
      (err) => {
        if (err) throw err;
        this.server.in(gameId).emit('updateGameData', gameId);
      },
    );
  }

  @SubscribeMessage('banpick')
  handleBanpick(@MessageBody() gameId: string) {
    this.server.in(gameId).emit('updateGameData', gameId);
  }

  @SubscribeMessage('selectChampion')
  handleSelectChampion(@MessageBody() payload) {
    const gameId = payload.gameId;
    const champion = payload.champion;
    this.server.in(gameId).emit('updateSelectedChampion', champion);
  }
}
