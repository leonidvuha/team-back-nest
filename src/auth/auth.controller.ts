import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './auth.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { type User } from '@prisma/client';

@Controller('/auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('/register')
  register(@Body() dto: RegisterDto) {
    return this.service.register(dto);
  }

  @Post('/login')
  login(@Body() dto: LoginDto) {
    return this.service.login(dto);
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard) // есть ли JWT - если есть - то сохраняет тек пользователя в req
  me(@CurrentUser() user: User) {
    return user;
  }
}
