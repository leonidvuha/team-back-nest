import z from 'zod';

export const CreateArtifactSchema = z.object({
  name: z.string().min(3, 'Name must at least contain 3 symbols'),
  age: z.number().min(0, 'Age must be positive'),
});

// тип после парсинга
export type CreateArifactDto = z.infer<typeof CreateArtifactSchema>;
