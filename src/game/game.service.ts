import { UpdateBanPickDto } from './dto/update-banpick.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateGameDto } from './dto/create-game.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Game } from './schema/game.schema';
import { ROLEDATA } from './constdata';
import mongoose from 'mongoose';

@Injectable()
export class GameService {
  constructor(
    @InjectModel(Game.name) private readonly gameModel: Model<Game>,
  ) {}

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

  //게임 전체 리스트
  findAll() {
    const gameList = this.gameModel.find().exec();
    return gameList;
  }

  //단일 게임정보
  async findOne(id: string) {
    console.log(id);

    const gameId = new mongoose.Types.ObjectId(id);
    const result = await this.gameModel.findById({ _id: gameId });
    return result;
  }

  //유저 리스트 업데이트
  async updateUserList(createUserDto: CreateUserDto): Promise<Game> {
    const { gameId, userId, name, side, role, isReady } = createUserDto;

    const updatedData = await this.gameModel
      .findById({ _id: gameId }, (err, result) => {
        if (err) throw err;
        const getUpdatedUserList = () => {
          const updatedUserList = result.userList;
          updatedUserList[side][ROLEDATA[role]] = {
            gameId: gameId,
            userId: userId,
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
            return result;
          },
        );
      })
      .clone();
    return updatedData;
  }

  //밴픽 리스트 업데이트
  updateBanPickList(updateBanPickDto: UpdateBanPickDto) {
    const { gameId, banPickList, banpickCount } = updateBanPickDto;

    this.gameModel.findByIdAndUpdate(
      { _id: gameId },
      {
        $set: {
          banPickList: banPickList,
          banpickCount: banpickCount + 1,
        },
      },
      { new: true },
      (err, result) => {
        return result;
      },
    );

    // return this.gameModel
    //   .findByIdAndUpdate(
    //     { _id: gameId },
    //     {
    //       $set: {
    //         banPickList: banPickList,
    //         banpickCount: banpickCount + 1,
    //       },
    //     },
    //     { new: true },
    //     (err, result) => {
    //       return result;
    //     },
    //   )
    //   .clone();
    return {
      banPickList: banPickList,
      banpickCount: banpickCount + 1,
    };
  }

  //게임 삭제
  remove(id: string) {
    return `게임 삭제 ${id}`;
  }
}
