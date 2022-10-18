import mongoose, { Date } from 'mongoose';

export interface IUser {
  _id: mongoose.Types.ObjectId;
  gameId: string;
  userId: string;
  clientId: string;
  name: string;
  side: string;
  role: string;
  mode: number;
  isReady: boolean;
  createdAt: Date;
}
