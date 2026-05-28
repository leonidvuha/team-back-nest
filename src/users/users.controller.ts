import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './users.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { type User } from '@prisma/client';

@Controller('users')
export class UsersController {
    constructor(private readonly usersServiсe: UsersService) {}

@Get('/profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser() user: User) {
    return this.usersServiсe.getProfile(user.id);
  }

  @Put('/profile')
  @UseGuards(JwtAuthGuard)
  updateProfile(@CurrentUser() user: User, @Body() dto: UpdateProfileDto) {
    return this.usersServiсe.updateProfile(user.id, dto);
  }
}

