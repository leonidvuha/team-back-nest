import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const UpdateProductsSchema = z.object({
  category_id: z.number().int().positive().optional(),
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
  lat: z
    .string()
    .refine(
      (val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num >= -90 && num <= 90;
      },
      {
        message: 'Latitude must be a valid numeric string between -90 and 90',
      },
    )
    .optional(),
  lng: z
    .string()
    .refine(
      (val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num >= -180 && num <= 180;
      },
      {
        message:
          'Longitude must be a valid numeric string between -180 and 180',
      },
    )
    .optional(),
  img: z.string().optional(),
  tags: z
    .array(
      z
        .string()
        .min(2)
        .max(40)
        .trim()
        .refine((val) => !/<[^>]*>/g.test(val), {
          message: 'Tags cannot contain special characters like < >',
        }),
    )
    .max(10)
    .optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

export class UpdateProductDto extends createZodDto(UpdateProductsSchema) {}
