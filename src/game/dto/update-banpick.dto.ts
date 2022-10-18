import { BanPickList } from './../interfaces/game.interface';

export class UpdateBanPickDto {
  gameId: string;
  banpickList: BanPickList;
  banpickCount: number;
}
