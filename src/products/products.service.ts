import { Injectable, BadGatewayException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

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
      },
    });

    return {
      id: product.id,
      owner_id: product.ownerId,
      category_id: product.categoryId,
      title: product.title,
      description: product.description,
      price: product.price,
      img_url: product.imageUrl,
      created_at: product.createdAt,
    };
  }
}
