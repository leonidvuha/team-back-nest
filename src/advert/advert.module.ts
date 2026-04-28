import { Module } from '@nestjs/common';
import { AdvertController } from './advert.controller';
import { AdvertService } from './advert.service';
import { AdvertRepository } from './advert.repository';

@Module({
  controllers: [AdvertController],
  providers: [AdvertService, AdvertRepository],
})
export class AdvertModule {}
