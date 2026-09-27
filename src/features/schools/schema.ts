import { z } from 'zod';

export const schoolSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Informe o nome da escola')
    .max(120, 'Use no máximo 120 caracteres'),
  address: z
    .string()
    .trim()
    .min(1, 'Informe o endereço da escola')
    .max(200, 'Use no máximo 200 caracteres'),
});

export type SchoolFormValues = z.infer<typeof schoolSchema>;
