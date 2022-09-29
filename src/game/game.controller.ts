import { CreateGameDto } from './dto/create-game.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  //게임 생성
  @Post()
  create(@Body() createGameDto: CreateGameDto) {
    return this.gameService.create(createGameDto);
  }

  //게임 리스트 전송
  @Get()
  findAll() {
    return this.gameService.findAll();
  }

  //단일 게임 데이터 전송
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gameService.findOne(id);
  }

  //게임 삭제
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gameService.remove(id);
  }

  //유저리스트 업데이트
  @Patch(':id')
  updateUserList(@Param('id') id: string) {
    return this.gameService.updateUserList(id);
  }

  //밴픽 리스트 업데이트
  @Patch(':id')
  updateBanPickList(@Param('id') id: string) {
    return this.gameService.updateBanPickList(id);
  }
}
