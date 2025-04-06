import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const LoginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1), // Or specific length if required
});

export class LoginUserDto extends createZodDto(LoginUserSchema) {}
