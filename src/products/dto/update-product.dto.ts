import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const UpdateProductsSchema = z.object({
  category_id: z
    .number()
    .int()
    .refine((val) => [1, 2, 3].includes(val), {
      message: 'category_id must be 1, 2, or 3',
    }),
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters')
    .refine((val) => !/<[^>]*>/g.test(val), {
      message: 'Special characters like < > are not allowed.',
    }),
  description: z
    .string()
    .trim()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be at most 500 characters')
    .refine((val) => !/<[^>]*>/g.test(val), {
      message: 'Special characters like < > are not allowed.',
    })
    .optional(),
  price: z.number().min(0.01).max(10000),
  unit: z.enum(['KG', 'L', 'ST']),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  img: z.string().optional(),
  tags: z.array(z.string().min(2).max(25).trim().max(10).optional()),
});

export class UpdateProductDto extends createZodDto(UpdateProductsSchema) {}
