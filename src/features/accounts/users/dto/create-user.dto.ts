import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const schema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email(),

  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(8, 'Password must be at least 8 characters')
    .refine(
      (value) => {
        const hasLowercase = /[a-z]/.test(value);
        const hasUppercase = /[A-Z]/.test(value);
        const hasNumber = /[0-9]/.test(value);
        const hasSpecial = /[^a-zA-Z0-9]/.test(value);

        return hasLowercase && hasUppercase && hasNumber && hasSpecial;
      },
      (value) => {
        const hasLowercase = /[a-z]/.test(value);
        const hasUppercase = /[A-Z]/.test(value);
        const hasNumber = /[0-9]/.test(value);
        const hasSpecial = /[^a-zA-Z0-9]/.test(value);

        return {
          message:
            'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character',
          params: {
            missing: [
              hasLowercase ? null : 'lowercase',
              hasUppercase ? null : 'uppercase',
              hasNumber ? null : 'number',
              hasSpecial ? null : 'special',
            ].filter(Boolean),
          },
        };
      },
    ),

  name: z.object(
    {
      given: z.string({
        required_error: 'First name is required',
      }),
      family: z.string({
        required_error: 'Last name is required',
      }),
    },
    {
      required_error: 'Name is required',
    },
  ),
});

export class CreateUserDto extends createZodDto(schema) {}
