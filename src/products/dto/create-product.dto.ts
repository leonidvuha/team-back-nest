import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const CreateProductSchema = z.object({
  category_id: z
    .number()
    .int()
    .refine((val) => [1, 2, 3].includes(val), {
      message: 'category_id must be 1, 2, or 3',
    }),
  name: z.string().min(2).max(100),
  description: z.string().min(10).max(500).optional(),
  price: z.number().min(0.01).max(10000),
  unit: z.enum(['KG', 'L', 'ST']),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  img: z.string().optional(),
});

export class CreateProductDto extends createZodDto(CreateProductSchema) {}
