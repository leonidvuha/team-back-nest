import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class FarmerService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllFarmers(page = 1, limit = 9) {
    const skip = (page - 1) * limit;

    const [farmers, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where: {
          products: { some: { status: 'ACTIVE' } },
        },
        select: {
          id: true,
          fullName: true,
          aboutMe: true,
          email: true,
          phone: true,
          _count: {
            select: {
              products: { where: { status: 'ACTIVE' } },
            },
          },
        },
        skip,
        take: limit,
      }),
      this.prisma.user.count({
        where: {
          products: { some: { status: 'ACTIVE' } },
        },
      }),
    ]);

    return {
      farmers: farmers.map((seller) => ({
        id: seller.id,
        fullName: seller.fullName,
        about_me: seller.aboutMe,
        contacts: {
          email: seller.email,
          phone: seller.phone,
        },
        active_products_count: seller._count.products,
      })),
      meta: {
        current_page: page,
        per_page: limit,
        total_items: total,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async getFarmerById(id: string) {
    try {
      // Используем include, так как в схеме связь products официально прописана!
      const farmer = await this.prisma.user.findUnique({
        where: { id },
        include: {
          products: {
            where: { status: 'ACTIVE' },
            include: { tags: true },
          },
        },
      });

      if (!farmer) {
        throw new NotFoundException('Landwirt nicht gefunden');
      }

      // Маппим данные из camelCase бэкенда в формат, который ждет фронтенд
      return {
        id: farmer.id,
        fullName: farmer.fullName,
        about_me: farmer.aboutMe,
        avatarUrl: farmer.avatarUrl,
        contacts: {
          email: farmer.email,
          phone: farmer.phone,
        },
        coordinates:
          farmer.lat && farmer.lng
            ? {
                lat: Number(farmer.lat),
                lng: Number(farmer.lng),
              }
            : null,
        // Продукты отдаем массивом, фронтенд сам разберет их внутренние поля
        products: farmer.products,
      };
    } catch {
      // Пустой catch без переменной ошибки, чтобы ESLint не ругался
      throw new Error('Fehler beim Laden des Landwirt-Profils');
    }
  }
}
