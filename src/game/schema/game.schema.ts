import { Turn } from './../interfaces/turn.interface';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, Document } from 'mongoose';
import { turnData } from '../constdata';

export type GameDocument = Game & Document;

@Schema()
export class Game {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  blueTeamName: string;

  @Prop({ required: true })
  redTeamName: string;

  @Prop({ required: true })
  mode: number;

  @Prop({ required: false })
  password: string;

  @Prop({ required: true })
  timer: boolean;

  @Prop({ type: [String], required: true })
  userList: string[];

  @Prop({ type: Object, required: true })
  banpickList: object;

  @Prop({ type: [Object], required: true, default: turnData })
  banpickTurnData: Turn[];

  @Prop({ required: true, default: 0 })
  banpickCount: number;

  @Prop({ required: true, default: false })
  isProceeding: boolean;

  @Prop({ type: Date, required: true, default: Date.now(), expires: 10000 })
  createdAt: Date;
}

export const GameSchema = SchemaFactory.createForClass(Game);
