import { IUser } from './user.interface';
import mongoose, { Date } from 'mongoose';
import { ITurn } from './turn.interface';

type UserList = {
  blue: IUser[];
  red: IUser[];
};

type BanPickList = {
  ban: {
    blue: string[];
    red: string[];
  };
  pick: {
    blue: string[];
    red: string[];
  };
};

export interface IGame {
  _id: mongoose.Types.ObjectId;
  title: string;
  blueTeamName: string;
  redTeamName: string;
  mode: number;
  password: string;
  timer: boolean;
  userList: UserList;
  banpickList: BanPickList;
  banpickTurnData: ITurn[];
  banpickCount: number;
  isProceeding: boolean;
  createdAt: Date;
}
