import {
  Controller,
  Post,
  Delete,
  Body,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { Userservice } from './users.service.js';
import { CreateUserDto } from './dto/create.user.dto.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: Userservice) {}

  @Post()
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.register(createUserDto);
  }

  @Post('sessions')
  async login(@Body() createUserDto: CreateUserDto) {
    return this.usersService.login(
      createUserDto.username,
      createUserDto.password,
    );
  }

  @Delete('sessions')
  async logout(@Headers('authorization') authHeader: string) {
    if (!authHeader) {
      throw new UnauthorizedException('Token not found');
    }

    const token = authHeader.replace('Bearer ', '');
    return this.usersService.logout(token);
  }
}
