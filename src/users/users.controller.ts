import { Body, Controller, Get, Put, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './users.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { type User } from '@prisma/client';
import { GetProductsDto } from 'src/products/dto/get-products.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser() user: User) {
    return this.usersService.getProfile(user.id);
  }

  @Put('/profile')
  @UseGuards(JwtAuthGuard)
  updateProfile(@CurrentUser() user: User, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(user.id, dto);
  }

  @Get('/my-products')
  @UseGuards(JwtAuthGuard)
  getMyProducts(@CurrentUser() user: User, @Query() query: GetProductsDto) {
    return this.usersService.getMyProducts(user.id, query);
  }
}
