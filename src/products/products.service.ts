import {
  Injectable,
  BadGatewayException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { GetProductsDto } from './dto/get-products.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    cloudinary.config({
      cloud_name: this.config.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.config.get('CLOUDINARY_API_KEY'),
      api_secret: this.config.get('CLOUDINARY_API_SECRET'),
    });
  }

  async create(dto: CreateProductDto, ownerId: string) {
    let img_url: string | null = null;

    if (dto.img) {
      try {
        const result = await cloudinary.uploader.upload(dto.img, {
          folder: 'products/farm_produce',
        });
        img_url = result.secure_url;
      } catch {
        throw new BadGatewayException({
          status: 'error',
          code: 'IMAGE_UPLOAD_FAILED',
          message: 'Failed to upload image to Cloudinary. Please try again.',
        });
      }
    }

    const product = await this.prisma.product.create({
      data: {
        title: dto.name,
        description: dto.description ?? '',
        price: dto.price,
        unit: dto.unit,
        categoryId: dto.category_id,
        ownerId: ownerId,
        lat: dto.lat,
        lng: dto.lng,
        imageUrl: img_url ?? '',
        tags: dto.tags ?? [],
      },
    });

    return {
      id: product.id,
      owner_id: product.ownerId,
      category_id: product.categoryId,
      title: product.title,
      description: product.description,
      price: product.price,
      unit: product.unit,
      img_url: product.imageUrl,
      tags: product.tags,
      created_at: product.createdAt,
    };
  }

  async findAll(dto: GetProductsDto) {
    const { page, limit, sort_by, order, category_id, owner_id } = dto;
    const skip = (page - 1) * limit;
    const sortField = sort_by === 'price' ? 'price' : 'createdAt';

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const where: { categoryId?: number; ownerId?: string } = {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      ...(category_id && { categoryId: category_id }),
      ...(owner_id && { ownerId: owner_id }),
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
        created_at: p.createdAt,
        tags: p.tags,
      })),
      meta: {
        current_page: page,
        per_page: limit,
        total_items: total,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async update(id: string, dto: UpdateProductDto, ownerId: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.ownerId !== ownerId) {
      throw new ForbiddenException('You are not the owner of this product');
    }

    let imageUrl = product.imageUrl;

    if (dto.img) {
      try {
        const result = await cloudinary.uploader.upload(dto.img, {
          folder: 'product/farm_produce',
        });
        imageUrl = result.secure_url;
      } catch {
        throw new BadGatewayException({
          status: 'error',
          code: 'IMAGE_UPLOAD_FAILED',
          message: 'Failed to upload image to Cloudinary. Please try again.',
        });
      }
    }

    const updated = await this.prisma.product.update({
      where: { id },
      data: {
        title: dto.name,
        description: dto.description ?? product.description,
        price: dto.price,
        unit: dto.unit,
        categoryId: dto.category_id,
        lat: dto.lat,
        lng: dto.lng,
        imageUrl,
        tags: dto.tags !== undefined ? (dto.tags as string[]) : undefined,
      },
    });

    return {
      id: updated.id,
      owner_id: updated.ownerId,
      category_id: updated.categoryId,
      title: updated.title,
      description: updated.description,
      price: updated.price,
      unit: updated.unit,
      img_url: updated.imageUrl,
      updated_at: updated.updatedAt,
      tags: updated.tags,
    };
  }
}
