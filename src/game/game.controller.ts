import { UpdateBanPickDto } from './dto/update-banpick.dto';
import { CreateGameDto } from './dto/create-game.dto';
import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  //게임 생성
  @Post()
  async createGame(@Body() createGameDto: CreateGameDto) {
    const result = await this.gameService.createGame(createGameDto);
    return result;
  }

  //게임 리스트 전송
  @Get()
  findAll() {
    return this.gameService.findAll();
  }

  @Get('/champions')
  getChampionList() {
    return this.gameService.championList();
  }

  //단일 게임 데이터 전송
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gameService.findOne(id);
  }

  //유저리스트 업데이트
  @Patch('/join')
  updateUserList(@Body() createUserDto: CreateUserDto) {
    return this.gameService.updateUserList(createUserDto);
  }

  //밴픽 리스트 업데이트
  @Patch('/banpick')
  updateBanPickList(@Body() updateBanPickDto: UpdateBanPickDto) {
    return this.gameService.updateBanPickList(updateBanPickDto);
  }
}
