import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './event.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class EventService {
  constructor(private readonly prisma: PrismaService) {}
  async create(userId: string, dto: CreateEventDto) {
    const event = await this.prisma.event.create({
      data: {
        title: dto.title,
        description: dto.description,
        participants: { connect: { id: userId } },
      },
      include: { participants: true }, // будет ли в ответе массив юзеров
    });
    return event;
  }
}
