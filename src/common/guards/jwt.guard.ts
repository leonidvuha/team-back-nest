import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

@Injectable()
export class OptinalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = any>(
    err: any,
    user: TUser | false,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _info: any,
  ): TUser | null {
    if (err || !user) {
      return null;
    }
    return user;
  }
}
