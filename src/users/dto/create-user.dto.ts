import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const CreateUserSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  age: z.number().optional(),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' }),
});

export class CreateUserDto extends createZodDto(CreateUserSchema) {}
