import { Injectable } from '@nestjs/common';
import { ProductStatus } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.category.findMany({
      orderBy: {
        id: 'asc',
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.category.findUnique({
      where: { id },
      include: {
        products: {
          where: { status: ProductStatus.ACTIVE },
        },
      },
    });
  }
}
