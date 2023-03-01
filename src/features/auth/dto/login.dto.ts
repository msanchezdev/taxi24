import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const schema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email(),
  password: z.string({
    required_error: 'Password is required',
  }),
});

export class LoginDto extends createZodDto(schema) {}
