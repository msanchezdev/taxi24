import { createZodDto } from 'nestjs-zod';
import * as z from 'nestjs-zod/z';
import { OtpDeliveryMethods, OtpPurposes } from '../otp.constants';

const schema = z.object({
  user: z
    .string({
      required_error: 'User email is required',
    })
    .email(),
  purpose: z.enum(OtpPurposes),
  delivery: z.object(
    {
      method: z.enum(OtpDeliveryMethods),

      // allow overriding delivery address
      address: z.string().optional(),
    },
    {
      required_error: 'Delivery information is required',
    },
  ),
});

export class RequestOtpDto extends createZodDto(schema) {}
