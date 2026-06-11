import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const SearchProductsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
  category_id: z.coerce.number().int().optional(),
  search: z.string().optional(),
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
  radius: z.coerce.number().default(25),
});

export class SearchProductsDto extends createZodDto(SearchProductsSchema) {}