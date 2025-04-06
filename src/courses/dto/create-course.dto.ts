import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const CreateCourseSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(), // Assuming description is optional
  instructor: z.string().optional(), // Assuming instructor is optional
  duration: z.number().int().positive().optional(), // Assuming duration is optional positive integer
});

export class CreateCourseDto extends createZodDto(CreateCourseSchema) {}
