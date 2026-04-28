import { Injectable } from '@nestjs/common';
import { Advert } from './advert.interface';

@Injectable()
export class AdvertRepository {
  private adverts: Advert[] = [
    {
      id: 0,
      image:
        'https://digitalsynopsis.com/wp-content/uploads/2024/12/best-art-directed-ads-1.jpg',
      content:
        'Братиславский зоопарк открыт каждый день, включая все праздничные и нерабочие дни.Мы будем рады видеть вас  365 дней  в году.',
      link: 'https://www.zoobratislava.sk/',
    },
  ];
  private idCounter = 1;
  findAll() {
    return this.adverts;
  }
}
