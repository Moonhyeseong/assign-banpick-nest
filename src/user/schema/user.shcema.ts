import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  gameId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  clientId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  side: string;

  @Prop({ required: true })
  role: string;

  @Prop({ required: true })
  mode: number;

  @Prop({ required: true })
  isReady: boolean;

  @Prop({ type: Date, required: true, default: Date.now(), expires: 10000 })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
