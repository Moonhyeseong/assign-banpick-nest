export class CreateUserDto {
  gameId: string;
  userId: string;
  clientId: string;
  name: string;
  side: string;
  role: string;
  mode: number;
  isReady: boolean;
}
