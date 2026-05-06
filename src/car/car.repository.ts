import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CarCreateInput } from './car.interface';
import { Car } from '@prisma/client';

@Injectable()
export class CarRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<Car[]> {
    return this.prisma.car.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  findById(id: number): Promise<Car | null> {
    return this.prisma.car.findUnique({ where: { id } });
  }

  create(data: CarCreateInput) {
    return this.prisma.car.create({ data });
  }

  delete(id: number): Promise<Car | null> {
    return this.prisma.car.delete({ where: { id } });
  }
}
