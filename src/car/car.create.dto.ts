import z from 'zod';

export const CreateCarSchema = z.object({
  brand: z.string().min(2, 'Brand must be at least 2 characters'),
  model: z.string().min(1, 'Model must be at least 1 characters'),
  price: z.coerce.number().positive('Price must be positive'),
  year: z.coerce.number().min(2000, 'Earliest year possible is 2000'),
});

export type CreateCarDto = z.infer<typeof CreateCarSchema>;

// latency - задержка между действием и ответом системы
// 120ms - low latency
// Network latency - как долго добиралось до бэка
// Processing latency - внутри бэка, например
// Disk latency - как записывалось/считывалось с диска

// Web vitals - посмотрите что это такое

// Tradeoffs
// System design - смотрите ролики на ютубе
