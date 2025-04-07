import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#])[A-Za-z\d@#]{8,}$/;
const passwordErrorMessage =
  'Password must be at least 8 characters long and include at least one letter, one number, @, and #';

const CreateUserSchema = z.object({
  first_name: z
    .string()
    .min(3, { message: 'First name must be at least 3 characters long' }),
  last_name: z.string().optional(),
  age: z.number().int().positive().optional(),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: passwordErrorMessage })
    .regex(passwordRegex, { message: passwordErrorMessage }),
});

export class CreateUserDto extends createZodDto(CreateUserSchema) {}
