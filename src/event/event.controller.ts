import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateEventDto } from './event.dto';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { type User } from '@prisma/client';
import { EventService } from './event.service';

@Controller('/events')
export class EventController {
  constructor(private readonly service: EventService) {}
  @Post()
  @UseGuards(JwtAuthGuard)
  createEvent(@Body() dto: CreateEventDto, @CurrentUser() user: User) {
    return this.service.create(user.id, dto);
  }

  //   @Get()
  //   @UseGuards(JwtAuthGuard)
  //   getAllUsersEvent(@CurrentUser() user: User) {}
}
