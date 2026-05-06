import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const CreateEventSchema = z.object({
  title: z.string().min(8, 'Min password length is 8 symbols'),
  description: z.string().min(8, 'Min password length is 8 symbols'),
});

export class CreateEventDto extends createZodDto(CreateEventSchema) {}
