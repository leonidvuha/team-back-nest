import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class FarmerService {
  constructor(private readonly prisma: PrismaService) {}

  async getActiveSellers() {
    const sellers = await this.prisma.user.findMany({
      where: {
        products: {
          some: {
            status: 'ACTIVE',
          },
        },
      },
      select: {
        id: true,
        fullName: true,
        aboutMe: true,
        email: true,
        phone: true,
        _count: {
          select: {
            products: {
              where: { status: 'ACTIVE' },
            },
          },
        },
      },
    });
    return sellers.map((seller) => ({
      id: seller.id,
      fullName: seller.fullName,
      about_me: seller.aboutMe,
      contacts: {
        email: seller.email,
        phone: seller.phone,
      },
      active_products_count: seller._count.products,
    }));
  }
  async getFarmerById(id: string) {
    try {
      // Используем include, так как в схеме связь products официально прописана!
      const farmer = await this.prisma.user.findUnique({
        where: { id },
        include: {
          products: true, // Prisma сама вытащит все продукты этого юзера
        },
      });

      if (!farmer) {
        console.log(
          `[Backend] Пользователь с ID ${id} не найден в базе данных Prisma`,
        );
        return null;
      }

      // Маппим данные из camelCase бэкенда в формат, который ждет фронтенд
      return {
        id: farmer.id,
        name: farmer.fullName, // Из схемы: fullName -> переводим в name для фронта
        about_me: farmer.aboutMe, // Из схемы: aboutMe -> в about_me
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
