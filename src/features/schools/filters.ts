import { matchesSearch } from '@/shared/utils/text';

import type { School } from './types';

export type SchoolFilter = 'all' | 'withClasses' | 'withoutClasses';

export const SCHOOL_FILTER_LABELS: Record<SchoolFilter, string> = {
  all: 'Todas',
  withClasses: 'Com turmas',
  withoutClasses: 'Sem turmas',
};

const FILTER_PREDICATES: Record<SchoolFilter, (school: School) => boolean> = {
  all: () => true,
  withClasses: (school) => school.classIds.length > 0,
  withoutClasses: (school) => school.classIds.length === 0,
};

export function filterSchools(schools: School[], query: string, filter: SchoolFilter): School[] {
  const predicate = FILTER_PREDICATES[filter];
  return schools.filter(
    (school) => predicate(school) && matchesSearch(query, school.name, school.address),
  );
}
