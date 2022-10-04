import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateGameDto } from './dto/create-game.dto';
import { Game } from './schema/game.schema';

@Injectable()
export class GameService {
  constructor(
    @InjectModel(Game.name) private readonly gameModel: Model<Game>,
  ) {}

  //게임 생성
  async createGame(createGameDto: CreateGameDto): Promise<Game> {
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
      blue: {
        ban: ['', '', '', '', ''],
        pick: ['', '', '', '', ''],
      },
      red: {
        ban: ['', '', '', '', ''],
        pick: ['', '', '', '', ''],
      },
    };

    return await new this.gameModel({
      title: createGameDto.title,
      blueTeamName: createGameDto.blueTeamName,
      redTeamName: createGameDto.redTeamName,
      mode: createGameDto.mode,
      timer: createGameDto.timer,
      userList: initialUserList(createGameDto.mode),
      banpickList: initialBanPickList,
      isProceeding: createGameDto.isProceeding,
    }).save();
  }

  //게임 전체 리스트
  findAll() {
    const gameList = this.gameModel.find().exec();
    return gameList;
  }

  //단일 게임정보
  findOne(id: string) {
    return this.gameModel.findOne({ id });
  }

  //유저 리스트 업데이트
  updateUserList(id: string) {
    return `유저 리스트 업데이트 ${id}`;
  }

  //밴픽 리스트 업데이트
  updateBanPickList(id: string) {
    return `밴픽 리스트 업데이트 ${id}`;
  }

  //게임 삭제
  remove(id: string) {
    return `게임 삭제 ${id}`;
  }
}
