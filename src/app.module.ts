// import { EventsGateway } from './events/events.gateway';
import { EventsModule } from './events/events.module';
import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { GameModule } from './game/game.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://mhs970:745263sy@cluster0.viyda96.mongodb.net/?retryWrites=true&w=majority',
      {
        dbName: 'banpick', // DB name
        useNewUrlParser: true,
      },
    ),
    GameModule,
    UserModule,
    EventsModule,
  ],
})
export class AppModule {}
