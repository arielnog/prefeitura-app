import { buildSchoolClass } from '@/test/factories';

import { filterClasses } from '../filters';

describe('filterClasses', () => {
  const morning = buildSchoolClass({ name: '1º Ano A', shift: 'morning', schoolYear: 2026 });
  const evening = buildSchoolClass({ name: 'EJA - Etapa 1', shift: 'evening', schoolYear: 2025 });
  const classes = [morning, evening];

  it('filters by shift', () => {
    expect(filterClasses(classes, '', 'evening')).toEqual([evening]);
    expect(filterClasses(classes, '', 'all')).toEqual(classes);
  });

  it('searches by name, shift label or school year', () => {
    expect(filterClasses(classes, 'eja', 'all')).toEqual([evening]);
    expect(filterClasses(classes, 'manha', 'all')).toEqual([morning]);
    expect(filterClasses(classes, '2025', 'all')).toEqual([evening]);
  });
});
