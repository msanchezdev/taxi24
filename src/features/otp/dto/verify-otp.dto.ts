import { createZodDto } from 'nestjs-zod';
import * as z from 'nestjs-zod/z';
import { OtpPurposes } from '../otp.constants';

const schema = z.object({
  user: z
    .string({
      required_error: 'User email is required',
    })
    .email(),
  purpose: z.enum(OtpPurposes),
  code: z.string({
    required_error: 'OTP code is required',
  }),
});

export class VerifyOtpDto extends createZodDto(schema) {}
