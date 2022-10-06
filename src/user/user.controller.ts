import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //유저 생성
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    const result = await this.userService.createUser(createUserDto);
    return result;
  }

  @Get(':id')
  async findUser(@Param('id') id: string) {
    const result = await this.userService.findUser(id);
    return result;
  }

  @Delete()
  async DeleteUser() {
    return '유저 삭제';
  }
}
