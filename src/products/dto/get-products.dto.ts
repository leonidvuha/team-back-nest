import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const GetProductsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
  sort_by: z.enum(['created_at', 'price']).default('created_at'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

export class GetProductsDto extends createZodDto(GetProductsSchema) {}
