import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const RegisterSchema = z.object({
  email: z.string().email('Invalid email').max(255).trim().toLowerCase(),
  fullName: z
    .string()
    .trim()
    .min(2, 'Fullname must be at least 2 characters')
    .max(50, 'Fullname must be at most 50 characters')
    .refine(
      (val) => /^[\p{L}\s'-]+$/u.test(val),
      'Full name can only contain letters, spaces, hyphens and apostrophes',
    ),
  password: z
    .string()
    .trim()
    .min(8, 'Min password length is 8 symbols')
    .max(72, 'Max password length is 72 symbols')
    .refine(
      (val) => /[A-Z]/.test(val),
      'Password must contain at least one uppercase letter',
    )
    .refine(
      (val) => /[0-9]/.test(val),
      'Password must contain at least one number',
    )
    .refine(
      (val) => /[!@#$%^&*_\-+=?]/.test(val),
      'Password must contain at least one special character',
    )
    .refine(
      (val) => !/<[^>]*>/g.test(val),
      'Special characters like < > are not allowed',
    ),
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email').max(255).trim().toLowerCase(),
  password: z
    .string()
    .trim()
    .min(8, 'Min password length is 8 symbols')
    .max(72, 'Max password length is 72 symbols')
    .refine(
      (val) => !/<[^>]*>/g.test(val),
      'Special characters like < > are not allowed',
    ),
});

export class RegisterDto extends createZodDto(RegisterSchema) {}
export class LoginDto extends createZodDto(LoginSchema) {}

export interface ProfileResponseDto {
  id: string;
  email: string;
  fullName: string;
  role: string;
}
