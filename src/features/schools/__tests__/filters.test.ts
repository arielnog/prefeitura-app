import { buildSchool } from '@/test/factories';

import { filterSchools } from '../filters';

describe('filterSchools', () => {
  const lobato = buildSchool({
    name: 'EMEF Monteiro Lobato',
    address: 'Rua das Palmeiras',
    classIds: ['1'],
  });
  const rural = buildSchool({ name: 'Escola Rural Santa Luzia', address: 'Estrada Municipal' });
  const schools = [lobato, rural];

  it('returns everything without query and filter', () => {
    expect(filterSchools(schools, '', 'all')).toEqual(schools);
  });

  it('searches by name or address ignoring accents', () => {
    expect(filterSchools(schools, 'lobato', 'all')).toEqual([lobato]);
    expect(filterSchools(schools, 'estrada', 'all')).toEqual([rural]);
  });

  it('filters by having classes', () => {
    expect(filterSchools(schools, '', 'withClasses')).toEqual([lobato]);
    expect(filterSchools(schools, '', 'withoutClasses')).toEqual([rural]);
  });

  it('combines query and filter', () => {
    expect(filterSchools(schools, 'lobato', 'withoutClasses')).toEqual([]);
  });
});
