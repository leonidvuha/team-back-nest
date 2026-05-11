import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class TodoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { title: string; ownerId: string }) {
    return this.prisma.todo.create({
      data: {
        title: data.title,
        participants: {
          create: {
            user: { connect: { id: data.ownerId } },
          },
        },
      },
      include: {
        participants: true,
      },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.todo.findMany({
      where: {
        participants: {
          some: { userId },
        },
      },
      include: {
        participants: {
          include: { user: false },
        },
      },
    });
  }
}
