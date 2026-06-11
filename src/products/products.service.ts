import {
  Injectable,
  BadGatewayException,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { GetProductsDto } from './dto/get-products.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductStatus } from '@prisma/client';
import { UpdateStatusDto } from './dto/update-status.dto';
import { Prisma } from '@prisma/client';
import { SearchProductsDto } from './dto/search-products.dto';

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
        title: dto.title,
        description: dto.description ?? '',
        price: dto.price,
        unit: dto.unit,
        categoryId: dto.category_id,
        ownerId: ownerId,
        lat: dto.lat,
        lng: dto.lng,
        imageUrl: img_url ?? '',
        tags: {
          connectOrCreate: dto.tags?.map((tagName) => ({
            where: { name: tagName },
            create: { name: tagName },
          })),
        },
      },
      include: { tags: true },
    });

    const tags = product.tags as Array<{ id: number; name: string }>;

    return {
      id: product.id,
      owner_id: product.ownerId,
      category_id: product.categoryId,
      title: product.title,
      description: product.description,
      price: product.price,
      unit: product.unit,
      img_url: product.imageUrl,
      tags: tags.map((t) => ({ id: t.id, name: t.name })),
      status: product.status,
      lat: +product.lat,
      lng: +product.lng,
      updated_at: product.updatedAt,
      created_at: product.createdAt,
    };
  }

  async findAll(dto: GetProductsDto) {
    const { page, limit, sort_by, order, category_id, owner_id } = dto;
    const skip = (page - 1) * limit;
    const sortField = sort_by === 'price' ? 'price' : 'createdAt';

    const where: {
      categoryId?: number;
      ownerId?: string;
      status?: ProductStatus;
      deletedAt: null;
    } = {
      status: ProductStatus.ACTIVE,
      deletedAt: null,

      ...(category_id && { categoryId: category_id }),
      ...(owner_id && { ownerId: owner_id }),
    };

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortField]: order },
        include: { tags: true },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      products: products.map((p) => {
        const productTags = p.tags as Array<{ id: number; name: string }>;
        return {
          id: p.id,
          owner_id: p.ownerId,
          category_id: p.categoryId,
          title: p.title,
          description: p.description,
          price: p.price,
          unit: p.unit,
          img_url: p.imageUrl,
          tags: productTags.map((t) => ({ id: t.id, name: t.name })),
          status: p.status,
          lat: +p.lat,
          lng: +p.lng,
          created_at: p.createdAt,
          updated_at: p.updatedAt,
        };
      }),
      meta: {
        current_page: page,
        per_page: limit,
        total_items: total,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async findMy(ownerId: string, dto: GetProductsDto) {
    const { page, limit } = dto;
    const skip = (page - 1) * limit;

    const where = { ownerId, deletedAt: null };

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
        include: { tags: true },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      products: products.map((p) => {
        const productTags = p.tags as Array<{ id: number; name: string }>;
        return {
          id: p.id,
          owner_id: p.ownerId,
          category_id: p.categoryId,
          title: p.title,
          description: p.description,
          price: p.price,
          unit: p.unit,
          img_url: p.imageUrl,
          tags: productTags.map((t) => ({ id: t.id, name: t.name })),
          status: p.status,
          lat: +p.lat,
          lng: +p.lng,
          created_at: p.createdAt,
          updated_at: p.updatedAt,
        };
      }),
      meta: {
        current_page: page,
        per_page: limit,
        total_items: total,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string, currentUserId?: string) {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(id)) {
      throw new BadRequestException({
        error: 'Invalid Product ID format',
        code: 'INVALID_ID',
      });
    }

    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        tags: true,
        owner: {
          select: {
            fullName: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!product || product.deletedAt !== null) {
      throw new NotFoundException({
        error: 'Product not found',
        code: 'PRODUCT_NOT_FOUND',
      });
    }

    if (
      product.status === ProductStatus.INACTIVE &&
      product.ownerId !== currentUserId
    ) {
      throw new NotFoundException({
        error: 'Product not found',
        code: 'PRODUCT_NOT_FOUND',
      });
    }

    const tags = product.tags as Array<{ id: number; name: string }>;

    return {
      id: product.id,
      owner_id: product.ownerId,
      category_id: product.categoryId,
      title: product.title,
      description: product.description,
      price: product.price,
      unit: product.unit,
      img_url: product.imageUrl,
      tags: tags.map((t) => ({ id: t.id, name: t.name })),
      lat: +product.lat,
      lng: +product.lng,
      contact: {
        fullName: product.owner.fullName,
        email: product.owner.email,
        phone: product.owner.phone ?? null,
      },
      created_at: product.createdAt,
      updated_at: product.updatedAt,
    };
  }

  async update(id: string, dto: UpdateProductDto, ownerId: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product || product.deletedAt !== null) {
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
        title: dto.title,
        description: dto.description ?? product.description,
        price: dto.price,
        unit: dto.unit,
        categoryId: dto.category_id,
        lat: dto.lat,
        lng: dto.lng,
        imageUrl,
        tags:
          dto.tags !== undefined
            ? {
                set: [],
                connectOrCreate: dto.tags.map((tagName) => ({
                  where: { name: tagName },
                  create: { name: tagName },
                })),
              }
            : undefined,
        ...(dto.status && { status: dto.status }),
      },
      include: { tags: true },
    });

    const updatedTags = updated.tags as Array<{ id: number; name: string }>;

    return {
      id: updated.id,
      owner_id: updated.ownerId,
      category_id: updated.categoryId,
      title: updated.title,
      description: updated.description,
      price: updated.price,
      unit: updated.unit,
      img_url: updated.imageUrl,
      tags: updatedTags.map((t) => ({ id: t.id, name: t.name })),
      status: updated.status,
      lat: +updated.lat,
      lng: +updated.lng,
      created_at: updated.createdAt,
      updated_at: updated.updatedAt,
    };
  }

  async updateStatus(id: string, dto: UpdateStatusDto, currentUserId: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product || product.deletedAt !== null) {
      throw new NotFoundException({
        error: 'Product not found',
        code: 'PRODUCT_NOT_FOUND',
      });
    }
    if (product.ownerId !== currentUserId) {
      throw new ForbiddenException({
        error: 'You are not the owner of this product',
        code: 'FORBIDDEN',
      });
    }
    const updated = await this.prisma.product.update({
      where: { id },
      data: {
        status: dto.status ? ProductStatus.ACTIVE : ProductStatus.INACTIVE,
      },
    });
    return {
      id: updated.id,
      owner_id: updated.ownerId,
      category_id: updated.categoryId,
      title: updated.title,
      status: updated.status,
      updated_at: updated.updatedAt,
    };
  }

  async delete(id: string, currentUserId: string) {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(id)) {
      throw new BadRequestException({
        error: 'Invalid Product ID format',
        code: 'INVALID_ID',
      });
    }

    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product || product.deletedAt !== null) {
      throw new NotFoundException({
        error: 'Product not found',
        code: 'PRODUCT_NOT_FOUND',
      });
    }

    if (product.ownerId !== currentUserId) {
      throw new ForbiddenException({
        error: 'You are not the owner of this product',
        code: 'FORBIDDEN',
      });
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: ProductStatus.INACTIVE,
      },
    });

    return {
      message: 'Product successfully deleted',
      id: updatedProduct.id,
    };
  }

  async searchProducts(dto: SearchProductsDto) {
    const { page, limit, category_id, search, lat, lng, radius } = dto;
    const skip = (page - 1) * limit;

    const buildWhere = (term?: string): Prisma.ProductWhereInput => {
      const words = term?.split(/\s+/).filter(Boolean) ?? [];
      return {
        status: ProductStatus.ACTIVE,
        deletedAt: null,
        ...(category_id && { categoryId: category_id }),
        ...(words.length > 0 && {
          AND: words.map((word) => ({
            OR: [
              { title: { contains: word, mode: 'insensitive' } },
              {
                tags: {
                  some: { name: { contains: word, mode: 'insensitive' } },
                },
              },
            ],
          })),
        }),
        ...(lat &&
          lng && {
            lat: { gte: lat - radius / 111, lte: lat + radius / 111 },
            lng: {
              gte: lng - radius / (111 * Math.cos((lat * Math.PI) / 180)),
              lte: lng + radius / (111 * Math.cos((lat * Math.PI) / 180)),
            },
          }),
      };
    };

    let where = buildWhere(search);
    let fallback = false;
    let fallbackWord = '';

    let total = await this.prisma.product.count({ where });

    if (total === 0 && search && search.trim().split(/\s+/).length > 1) {
      fallbackWord = search.trim().split(/\s+/)[0];
      where = buildWhere(fallbackWord);
      total = await this.prisma.product.count({ where });
      fallback = true;
    }

    const products = await this.prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { tags: true },
    });

    return {
      products: products.map((p) => {
        const productTags = p.tags as Array<{ id: number; name: string }>;
        return {
          id: p.id,
          owner_id: p.ownerId,
          category_id: p.categoryId,
          title: p.title,
          description: p.description,
          price: p.price,
          unit: p.unit,
          img_url: p.imageUrl,
          tags: productTags.map((t) => ({ id: t.id, name: t.name })),
          status: p.status,
          lat: +p.lat,
          lng: +p.lng,
          created_at: p.createdAt,
          updated_at: p.updatedAt,
        };
      }),
      meta: {
        current_page: page,
        per_page: limit,
        total_items: total,
        total_pages: Math.ceil(total / limit),
        fallback,
        fallback_word: fallbackWord,
      },
    };
  }
}
