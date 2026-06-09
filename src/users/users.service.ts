import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UpdateProfileDto } from './dto/users.dto';
import { toProfileResponseDto } from 'src/auth/auth.mapper';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { UploadAvatarDto } from './dto/upload-avatar.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    cloudinary.config({
      cloud_name: this.config.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.config.get('CLOUDINARY_API_KEY'),
      api_secret: this.config.get('CLOUDINARY_API_SECRET'),
    });
  }

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

  async updateAvatar(userId: string, dto: UploadAvatarDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    let avatarUrl = '';

    try {
      const result = await cloudinary.uploader.upload(dto.img, {
        folder: 'users/avatars',
      });
      avatarUrl = result.secure_url;
    } catch {
      throw new BadGatewayException({
        status: 'error',
        code: 'IMAGE_UPLOAD_FAILED',
        message: 'Failed to upload avatar to Cloudinary',
      });
    }
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { avatarUrl: avatarUrl },
    });
    return {
      message: 'Avatar successfully updated',
      avatarUrl: updatedUser.avatarUrl,
    };
  }

  async getActiveSellers() {
    const users = await this.prisma.user.findMany({
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
        email: true,
        phone: true,
        aboutMe: true,
        products: {
          where: {
            status: 'ACTIVE',
          },
          select: {
            id: true,
            title: true,
            price: true,
          },
        },
      },
    });

    return users.map((user) => ({
      id: user.id,
      name: user.fullName,
      contacts: {
        email: user.email,
        phone: user.phone ?? null,
      },
      about_me: user.aboutMe ?? '',
      products: user.products,
      active_products_count: user.products.length,
    }));
  }
}
