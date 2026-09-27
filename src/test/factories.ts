import type { SchoolClass } from '@/features/classes/types';
import type { School } from '@/features/schools/types';

let sequence = 0;
const nextId = () => String(++sequence);
const timestamp = '2026-01-01T00:00:00.000Z';

export const buildSchool = (overrides: Partial<School> = {}): School => ({
  id: nextId(),
  name: 'Escola Teste',
  address: 'Rua Teste, 1',
  classIds: [],
  createdAt: timestamp,
  updatedAt: timestamp,
  ...overrides,
});

export const buildSchoolClass = (overrides: Partial<SchoolClass> = {}): SchoolClass => ({
  id: nextId(),
  schoolId: '1',
  name: '1º Ano A',
  shift: 'morning',
  schoolYear: 2026,
  createdAt: timestamp,
  updatedAt: timestamp,
  ...overrides,
});
