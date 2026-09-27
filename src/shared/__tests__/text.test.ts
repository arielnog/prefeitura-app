import { initials, matchesSearch, normalize, pluralize } from '../utils/text';

describe('text utils', () => {
  it('normalizes accents and casing', () => {
    expect(normalize('  Cecília MEIRELES ')).toBe('cecilia meireles');
  });

  it('matches any field ignoring accents, and everything for an empty query', () => {
    expect(matchesSearch('cecilia', 'Escola Cecília Meireles', 'Av. Brasil')).toBe(true);
    expect(matchesSearch('brasil', 'Escola X', 'Av. Brasil')).toBe(true);
    expect(matchesSearch('lobato', 'Escola X', 'Rua Y')).toBe(false);
    expect(matchesSearch('  ', 'Escola X')).toBe(true);
  });

  it('builds initials skipping generic school words', () => {
    expect(initials('EMEF Monteiro Lobato')).toBe('ML');
    expect(initials('Escola Municipal Cecília Meireles')).toBe('CM');
    expect(initials('Escola Municipal')).toBe('EM');
  });

  it('pluralizes by count', () => {
    expect(pluralize(1, 'turma', 'turmas')).toBe('1 turma');
    expect(pluralize(0, 'turma', 'turmas')).toBe('0 turmas');
  });
});
