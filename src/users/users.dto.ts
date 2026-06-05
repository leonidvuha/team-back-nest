import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const UpdateProfileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Fullname must be at least 2 characters')
    .max(50, 'Fullname must be at most 50 characters')
    .refine(
      (val) => /^[\p{L}\s'-]+$/u.test(val),
      'Full name can only contain letters, spaces, hyphens and apostrophes',
    )
    .optional(),

  phone: z
  .string()
  .trim()
  .min(6, 'Invalid phone')
  .max(20, 'Invalid phone')
  .regex(/^\+?[\d]+$/, 'Phone can only contain numbers and +')
  .nullable()
  .optional(),

  avatarUrl: z.string().url('Invalid URL').nullable().optional(),

  aboutMe: z
    .string()
    .trim()
    .max(500, 'About me must be at most 500 characters')
    .refine(
      (val) => !/<[^>]*>/g.test(val),
      'Special characters like < > are not allowed',
    )
    .nullable()
    .optional(),

  lat: z
  .number()
  .nullable()
  .optional(),

lng: z
  .number()
  .nullable()
  .optional(),

  city: z
    .string()
    .trim()
    .max(100, 'City name is too long')
    .refine(
      (val) => /^[\p{L}\s'-]+$/u.test(val),
      'City can only contain letters',
    )
    .nullable()
    .optional(),
});

export class UpdateProfileDto extends createZodDto(UpdateProfileSchema) {}
