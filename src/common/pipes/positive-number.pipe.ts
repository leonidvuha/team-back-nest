import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class PositiveNumberPipe implements PipeTransform {
  transform(value: number) {
    if (value < 0) {
      throw new BadRequestException();
    }
    return value;
  }
}

// для примера напишем самостоятельно Parse int Pipe
@Injectable()
export class CustomParseInt implements PipeTransform {
  transform(value: string) {
    const num: number = parseInt(value);
    if (!num) {
      throw new BadRequestException('Must be numeric string');
    }
    return num;
  }
}
