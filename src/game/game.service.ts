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

  create(createGameDto: CreateGameDto) {
    return '새 게임 생성';
  }

  findAll() {
    return this.gameModel.find().exec();
  }

  findOne(id: number) {
    return `게임하나 찾기`;
  }

  updateUserList() {
    return '유저 리스트 업데이트';
  }

  updateBanPickList() {
    return '밴픽 리스트 업데이트';
  }

  remove(id: number) {
    return `게임 삭제`;
  }
}
