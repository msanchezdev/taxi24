import { createZodDto } from 'nestjs-zod';
import * as z from 'nestjs-zod/z';

const schema = z.object({
  id: z.string({
    required_error: 'Orgnaization Id is required',
  }),
  name: z.string({
    required_error: 'Name is required',
  }),
  description: z.string({
    required_error: 'Description is required',
  }),
  logo: z.string().url('Invalid logo URL provided').optional(),
});

export class CreateOrganizationDto extends createZodDto(schema) {}
