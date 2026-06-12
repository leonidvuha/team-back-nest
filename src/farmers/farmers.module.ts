import { Module } from '@nestjs/common';
import { FarmersController } from './farmers.controller';
import { FarmerService } from './farmers.service';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [FarmersController],
  providers: [FarmerService, PrismaService],
})
export class FarmersModule {}
