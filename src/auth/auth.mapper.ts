import { User } from '@prisma/client';
import { ProfileResponseDto } from './auth.dto';

export const toProfileResponseDto = (user: User): ProfileResponseDto => {
  return { id: user.id, email: user.email, role: user.role };
};
