export const normalize = (value: string) =>
  value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

export const matchesSearch = (query: string, ...fields: string[]) => {
  const needle = normalize(query);
  return !needle || fields.some((field) => normalize(field).includes(needle));
};

const GENERIC_WORDS = new Set([
  'escola',
  'municipal',
  'estadual',
  'emef',
  'emei',
  'de',
  'da',
  'do',
  'das',
  'dos',
  'e',
]);

export const initials = (name: string) => {
  const words = name.split(/\s+/).filter(Boolean);
  const meaningful = words.filter((word) => !GENERIC_WORDS.has(normalize(word)));
  return (meaningful.length ? meaningful : words)
    .slice(0, 2)
    .map((word) => word[0]!.toUpperCase())
    .join('');
};

export const pluralize = (count: number, singular: string, plural: string) =>
  `${count} ${count === 1 ? singular : plural}`;
