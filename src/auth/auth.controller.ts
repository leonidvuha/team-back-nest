import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './auth.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { type User } from '@prisma/client';
import { Roles } from 'src/common/decorator/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { toProfileResponseDto } from './auth.mapper';

@Controller('/auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('/register')
  register(@Body() dto: RegisterDto) {
    return this.service.register(dto);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.service.login(dto);
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard) 
  me(@CurrentUser() user: User) {
    return toProfileResponseDto(user);
  }

  @Get('/admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  adminOnly(@CurrentUser() user: User) {
    return user;
  }
}
