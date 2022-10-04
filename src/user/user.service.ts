import { Game } from './../game/schema/game.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schema/user.shcema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Game.name) private readonly gameModel: Model<Game>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { gameId, userId, name, side, role, mode, isReady } = createUserDto;

    // this.gameModel.findByIdAndUpdate(
    //   { _id: gameId },
    //   { userList: { solo: userId } },
    //   (err, result) => {
    //     console.log(result);
    //   },
    // );

    return await new this.userModel({
      gameId,
      userId,
      name,
      side,
      role,
      mode,
      isReady,
    }).save();
  }
}
