// todo.controller.ts
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { TodoService } from './todo.service';

import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { createTodoSchema, type CreateTodoDto } from './todo.schema';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { type User } from '@prisma/client';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';

@Controller('todos')
export class TodoController {
  constructor(private readonly service: TodoService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @CurrentUser() user: User,
    @Body(new ZodValidationPipe(createTodoSchema))
    dto: CreateTodoDto,
  ) {
    return this.service.create(user.id, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async myTodos(@CurrentUser() user: User) {
    return this.service.getMyTodos(user.id);
  }
}
