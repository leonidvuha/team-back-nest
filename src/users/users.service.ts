import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UpdateProfileDto } from './users.dto';
import { toProfileResponseDto } from 'src/auth/auth.mapper';

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
}
