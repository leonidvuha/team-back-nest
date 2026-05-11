import { Injectable } from '@nestjs/common';
import { TodoRepository } from './todo.repository';
import { CreateTodoDto } from './todo.schema';

@Injectable()
export class TodoService {
  constructor(private readonly repo: TodoRepository) {}

  async create(userId: string, dto: CreateTodoDto) {
    return this.repo.create({
      title: dto.title,
      ownerId: userId,
    });
  }

  async getMyTodos(userId: string) {
    return this.repo.findByUser(userId);
  }
}
