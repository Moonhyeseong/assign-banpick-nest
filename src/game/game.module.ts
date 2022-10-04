import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema } from './schema/game.schema';
import { GameService } from './game.service';
import { GameController } from './game.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
  ],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
