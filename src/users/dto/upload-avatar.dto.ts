import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const UploadAvatarSchema = z.object({
  img: z.string({ message: 'Image data is required' }).trim(),
});
export class UploadAvatarDto extends createZodDto(UploadAvatarSchema) {}
