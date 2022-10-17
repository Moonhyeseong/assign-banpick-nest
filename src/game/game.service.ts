import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IGame } from './interfaces/game.interface';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateBanPickDto } from './dto/update-banpick.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Game } from './schema/game.schema';
import { ROLEDATA } from './constdata';

@Injectable()
export class GameService {
  constructor(
    @InjectModel(Game.name) private readonly gameModel: Model<Game>,
  ) {}

  //게임 전체 리스트
  findAll() {
    const gameList = this.gameModel.find().sort({ createdAt: -1 }).exec();
    return gameList;
  }

  //게임 생성
  async createGame(createGameDto: CreateGameDto): Promise<Game> {
    const { title, blueTeamName, redTeamName, mode, timer, isProceeding } =
      createGameDto;
    const initialUserList = (mode: number) => {
      if (mode === 0) {
        return {
          blue: ['solo'],
          red: ['solo'],
        };
      } else if (mode === 1) {
        return {
          blue: [''],
          red: [''],
        };
      } else if (mode === 2) {
        return {
          blue: ['', '', '', '', ''],
          red: ['', '', '', '', ''],
        };
      }
    };

    const initialBanPickList = {
      ban: {
        blue: ['', '', '', '', ''],
        red: ['', '', '', '', ''],
      },
      pick: {
        blue: ['', '', '', '', ''],
        red: ['', '', '', '', ''],
      },
    };

    return await new this.gameModel({
      title: title,
      blueTeamName: blueTeamName,
      redTeamName: redTeamName,
      mode: mode,
      timer: timer,
      userList: initialUserList(mode),
      banpickList: initialBanPickList,
      isProceeding: isProceeding,
    }).save();
  }

  //단일 게임정보
  async findOne(id: string) {
    return await this.gameModel.findById({ _id: id }).exec();
  }

  //유저 리스트 업데이트
  async updateUserList(createUserDto: CreateUserDto): Promise<Game> {
    const { gameId, userId, clientId, name, side, role, isReady } =
      createUserDto;

    const updatedData = await this.gameModel
      .findById({ _id: gameId }, (err: Error, result: IGame) => {
        if (err) throw err;
        const getUpdatedUserList = () => {
          const updatedUserList = result.userList;
          updatedUserList[side][ROLEDATA[role]] = {
            gameId: gameId,
            userId: userId,
            clientId: clientId,
            name: name,
            side: side,
            role: role,
            isReady: isReady,
            isOnline: true,
          };
          return updatedUserList;
        };

        return this.gameModel.findByIdAndUpdate(
          { _id: gameId },
          { userList: getUpdatedUserList() },
          { new: true },
          (err, result) => {
            if (err) throw err;
            return result;
          },
        );
      })
      .clone();
    return updatedData;
  }

  //밴픽 리스트 업데이트
  async updateBanPickList(updateBanPickDto: UpdateBanPickDto) {
    const { gameId, banpickList, banpickCount } = updateBanPickDto;

    const updateGameData = await this.gameModel
      .findByIdAndUpdate(
        { _id: gameId },
        {
          $set: {
            banpickList: banpickList,
            banpickCount: banpickCount + 1,
          },
        },
        { new: true },
      )
      .exec();

    return updateGameData;
  }

  updateUserReady() {
    return '유저 준비';
  }

  //게임 삭제
  removeGame(id: string) {
    return `게임 삭제 ${id}`;
  }
}
