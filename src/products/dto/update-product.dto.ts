import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const UpdateProductsSchema = z.object({
  category_id: z.number().int().positive().optional(),
  title: z
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
    .number({ message: 'Latitude must be a number' })
    .min(-90)
    .max(90)
    .multipleOf(0.000001, {
      message: 'Latitude cannot have more than 6 decimal places',
    })
    .optional(),

  lng: z
    .number({ message: 'Longitude must be a number' })
    .min(-180)
    .max(180)
    .multipleOf(0.000001, {
      message: 'Longitude cannot have more than 6 decimal places',
    })
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
