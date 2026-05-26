import {
  Injectable,
  BadGatewayException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { GetProductsDto } from './dto/get-products.dto';

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
    const existing = await this.prisma.product.findFirst({
      where: {
        title: dto.name,
        ownerId: ownerId,
      },
    });

    if (existing) {
      throw new ConflictException('Product with this name already exists');
    }

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
      created_at: product.createdAt,
    };
  }

  async findAll(dto: GetProductsDto) {
    const { page, limit, sort_by, order } = dto;
    const skip = (page - 1) * limit;
    const sortField = sort_by === 'price' ? 'price' : 'createdAt';

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        skip,
        take: limit,
        orderBy: { [sortField]: order },
      }),
      this.prisma.product.count(),
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
