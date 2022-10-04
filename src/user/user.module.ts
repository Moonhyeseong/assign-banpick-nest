import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.shcema';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Game, GameSchema } from 'src/game/schema/game.schema';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
