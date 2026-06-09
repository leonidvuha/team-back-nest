import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class FarmerService {
  constructor(private readonly prisma: PrismaService) {}

  async getFarmerById(id: string) {
    const farmer = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        aboutMe: true,
        email: true,
        phone: true,
        lat: true,
        lng: true,
        products: {
          where: { status: 'ACTIVE' },
          select: {
            id: true,
            title: true,
            price: true,
            imageUrl: true,
          },
        },
      },
    });

    if (!farmer) {
      throw new NotFoundException('Farmer not found');
    }
    return {
      id: farmer.id,
      name: farmer.fullName,
      about_me: farmer.aboutMe,
      contacts: {
        email: farmer.email,
        phone: farmer.phone ?? null,
      },
      coordinates: {
        lat: farmer.lat ? +farmer.lat : null,
        lng: farmer.lng ? +farmer.lng : null,
      },
      products: farmer.products,
    };
  }
}
