import { Injectable } from '@nestjs/common';
import { AdvertRepository } from './advert.repository';

@Injectable()
export class AdvertService {
  constructor(private readonly advertRepository: AdvertRepository) {}
  findAll() {
    return this.advertRepository.findAll();
  }
}
