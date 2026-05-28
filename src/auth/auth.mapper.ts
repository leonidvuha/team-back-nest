import { User } from '@prisma/client';
import { ProfileResponseDto } from './auth.dto';

export const toProfileResponseDto = (user: User): ProfileResponseDto => {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    phone: user.phone,
    avatarUrl: user.avatarUrl,
    aboutMe: user.aboutMe,
    latitude: user.latitude,
    longitude: user.longitude,
    city: user.city,
  };
};
