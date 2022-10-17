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
  logger: Map<string, string> = new Map();

  constructor(
    @InjectModel(Game.name) private readonly gameModel: Model<Game>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('socket-conncet')
  async initSocketConnection(@ConnectedSocket() client: Socket) {
    client.join('lobby');
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

    this.logger[client.id] = gameId;
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

  @SubscribeMessage('disconnect')
  handleDisconnect(@ConnectedSocket() client: Socket) {
    //유저가 가지고 있는 클라이언트 id 받음 => 해당 id를 가지고 있는 유저를 유저 리스트에서 삭제
    this.logger[client.id] && console.log(this.logger[client.id]);
  }
}
