import { IUser } from './../game/interfaces/user.interface';
import { Server, Socket } from 'socket.io';
import { Model } from 'mongoose';
import { Injectable, BadRequestException } from '@nestjs/common';
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

type StorageIds = {
  gameId: string;
  userId: string;
};

@Injectable()
@WebSocketGateway({ transports: ['websocket'] })
export class EventsGateway {
  userLogger: Map<string, string> = new Map();

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

    this.userLogger[client.id] = gameId;
  }

  @SubscribeMessage('userJoinWatingRoom')
  handleUserJoinWatingRoom(@MessageBody() data: StorageIds) {
    this.server.in(data.gameId).emit('updateGameData', data.gameId);
    this.server.in('lobby').emit('updateGameList');
    this.server.in('lobby').emit('updateGameListTest', 'updateGameListTest');
  }

  @SubscribeMessage('userReadyEvent')
  async handleUserReadyEvent(@MessageBody() data: IUser) {
    const gameId = data.gameId;
    const userId = data.userId;

    if (userId === undefined || gameId === undefined) {
      throw new BadRequestException('missing id');
    }
    //단일 게임 데이터 업데이트
    this.gameModel.findById({ _id: gameId }, (err: object, result: IGame) => {
      if (err) throw new BadRequestException(err);

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
          if (err) throw new BadRequestException(err);
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
        if (err) throw new BadRequestException(err);
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
        if (err) throw new BadRequestException(err);
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
    const gameId = this.userLogger[client.id];

    if (gameId !== undefined) {
      this.gameModel.findById({ _id: gameId }, (err, result: IGame) => {
        if (err) throw new BadRequestException(err);

        if (result?.isProceeding) {
          this.server.in(gameId).emit('shutdownSimulator', 'shutdownSimulator');
          this.gameModel.deleteOne({ _id: gameId }).exec();
          this.userModel.deleteMany({ gameId: gameId }).exec();
        } else {
          const updatedBlueUserListData = [];
          const updatedRedUserListData = [];

          const blueUserListData = result?.userList.blue;
          const redUserListData = result?.userList.red;

          blueUserListData?.map((user) => {
            if (user.clientId === client.id) {
              updatedBlueUserListData.push('');
            } else {
              updatedBlueUserListData.push(user);
            }
            return updatedBlueUserListData;
          });

          redUserListData?.map((user) => {
            if (user.clientId === client.id) {
              updatedRedUserListData.push('');
            } else {
              updatedRedUserListData.push(user);
            }
            return updatedRedUserListData;
          });

          this.gameModel.findByIdAndUpdate(
            { _id: gameId },
            {
              userList: {
                blue: updatedBlueUserListData,
                red: updatedRedUserListData,
              },
            },
            { new: true },
            (err, updatedData: IGame) => {
              if (err) throw new BadRequestException(err);

              //유저이탈후 참가인원 검사
              const activeBlueTeamUsers = updatedData?.userList.blue.filter(
                (user: any) => {
                  return user !== '';
                },
              );
              const activeRedTeamUsers = updatedData?.userList.red.filter(
                (user: any) => {
                  return user !== '';
                },
              );
              if (
                activeBlueTeamUsers?.length === 0 &&
                activeRedTeamUsers?.length === 0
              ) {
                this.gameModel.deleteOne({ _id: gameId }).exec();
                this.userModel.deleteMany({ game_id: gameId }).exec();
              }

              this.server.emit('updateGameList', 'updateGameList');
              this.server.in(gameId).emit('updateGameData', gameId);
              this.userLogger.delete(client.id);
            },
          );
        }
      });
    }
  }
}
