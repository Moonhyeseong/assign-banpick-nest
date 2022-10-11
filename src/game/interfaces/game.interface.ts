import mongoose, { Date } from 'mongoose';
import { ITurn } from './turn.interface';

export interface IGame {
  _id: mongoose.Types.ObjectId;
  title: string;
  blueTeamName: string;
  redTeamName: string;
  mode: number;
  password: string;
  timer: boolean;
  userList: object;
  banpickList: object;
  banpickTurnData: ITurn[];
  banpickCount: number;
  isProceeding: boolean;
  createdAt: Date;
}
