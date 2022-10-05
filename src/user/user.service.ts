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

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { gameId, userId, name, side, role, mode, isReady } = createUserDto;

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

  async findUser(id: string) {
    return await this.userModel.findById({ _id: id });
  }
}
