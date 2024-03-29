import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schema/user.shcema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  //유저 데이터 추가
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { gameId, userId, clientId, name, side, role, mode, isReady } =
      createUserDto;
    return await new this.userModel({
      gameId,
      userId,
      clientId,
      name,
      side,
      role,
      mode,
      isReady,
    }).save();
  }

  //유저 정보 전송
  async findUser(id: string) {
    return await this.userModel.findOne({ userId: id }).exec();
  }
}
