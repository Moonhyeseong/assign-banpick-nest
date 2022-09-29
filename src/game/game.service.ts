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
  create(createGameDto: CreateGameDto) {
    const initialUserList = (mode: number) => {
      if (mode === 1 || mode === 0) {
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

    return this.gameModel.create(
      {
        title: createGameDto.title,
        blueTeamName: createGameDto.blueTeamName,
        redTeamName: createGameDto.redTeamName,
        mode: createGameDto.mode,
        timer: createGameDto.timer,
        userList: initialUserList(createGameDto.mode),
        banpickList: initialBanPickList,
        isProceeding: createGameDto.isProceeding,
      },
      () => {
        console.log('게임 생성');
      },
    );
  }

  //게임 전체 리스트
  findAll() {
    return this.gameModel.find().exec();
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
