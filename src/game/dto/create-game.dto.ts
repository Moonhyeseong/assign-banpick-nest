export class CreateGameDto {
  title: string;
  blueTeamName: string;
  redTeamName: string;
  mode: number;
  timer: boolean;
  isProceeding: boolean;
}
