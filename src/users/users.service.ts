import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UpdateProfileDto } from './users.dto';
import { toProfileResponseDto } from 'src/auth/auth.mapper';
import { GetProductsDto } from 'src/products/dto/get-products.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User are not found');
    }
    return toProfileResponseDto(user);
  }

  async updateProfile(id: string, dto: UpdateProfileDto) {
    const data = Object.fromEntries(
      Object.entries(dto).filter(([, value]) => value !== undefined),
    );

    const user = await this.prisma.user.update({
      where: { id },
      data,
    });

    return toProfileResponseDto(user);
  }

  async getMyProducts(id: string, dto: GetProductsDto) {
    const { page, limit, sort_by, order } = dto;
    const skip = (page - 1) * limit;

    const sortField = sort_by === 'price' ? 'price' : 'createdAt';

    const where = {
      ownerId: id,
      deletedAt: null,
    };

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortField]: order },
      }),
      this.prisma.product.count({ where }),
    ]);
    return {
      products: products.map((p) => ({
        id: p.id,
        owner_id: p.ownerId,
        category_id: p.categoryId,
        title: p.title,
        description: p.description,
        price: p.price,
        unit: p.unit,
        img_url: p.imageUrl,
        tags: p.tags,
        is_active: p.status === 'ACTIVE',
        lat: p.lat,
        lng: p.lng,
        created_at: p.createdAt,
        updated_at: p.updatedAt,
      })),
      meta: {
        current_page: page,
        per_page: limit,
        total_items: total,
        total_pages: Math.ceil(total / limit),
      },
    };
  }
}
