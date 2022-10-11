import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema } from '../game/schema/game.schema';
import { User, UserSchema } from '../user/schema/user.shcema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [EventsGateway],
})
export class EventsModule {}
