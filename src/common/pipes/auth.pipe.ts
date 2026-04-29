import {
  Injectable,
  PipeTransform,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthPipe implements PipeTransform {
  transform(value: Record<string, string>) {
    if (!value['authorization']) {
      throw new UnauthorizedException('Authorization header is missing');
    }
    return value;
  }
}
