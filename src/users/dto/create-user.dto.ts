import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// Password regex: min 8 chars, at least one letter, one number, one #, one @
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#])[A-Za-z\d@#]{8,}$/;
const passwordErrorMessage =
  'Password must be at least 8 characters long and include at least one letter, one number, @, and #';

const CreateUserSchema = z.object({
  first_name: z
    .string()
    .min(3, { message: 'First name must be at least 3 characters long' }),
  last_name: z.string().optional(), // Optional as per rules
  age: z.number().int().positive().optional(),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: passwordErrorMessage }) // Keep min length for initial check
    .regex(passwordRegex, { message: passwordErrorMessage }),
});

export class CreateUserDto extends createZodDto(CreateUserSchema) {}
