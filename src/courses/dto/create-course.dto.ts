import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const CreateCourseSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
});

export class CreateCourseDto extends createZodDto(CreateCourseSchema) {}
