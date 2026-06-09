import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from 'prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { FarmersController } from './farmers.controller';
import { FarmerService } from './farmers.service';

@Module({
  imports: [ConfigModule],
  controllers: [UsersController, FarmersController],
  providers: [UsersService, FarmerService, PrismaService],
})
export class UsersModule {}
