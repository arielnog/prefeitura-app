import { z } from 'zod';

import { SHIFTS } from './types';

export const MIN_SCHOOL_YEAR = 2000;
export const MAX_SCHOOL_YEAR = 2100;

export const schoolClassSchema = z.object({
  name: z.string().trim().min(1, 'Informe o nome da turma').max(60, 'Use no máximo 60 caracteres'),
  shift: z.enum(SHIFTS, { message: 'Selecione o turno' }),
  schoolYear: z
    .number({ message: 'Informe o ano letivo' })
    .int('Ano letivo inválido')
    .min(MIN_SCHOOL_YEAR, `Ano letivo deve ser a partir de ${MIN_SCHOOL_YEAR}`)
    .max(MAX_SCHOOL_YEAR, `Ano letivo deve ser até ${MAX_SCHOOL_YEAR}`),
});

export type SchoolClassFormValues = z.infer<typeof schoolClassSchema>;
