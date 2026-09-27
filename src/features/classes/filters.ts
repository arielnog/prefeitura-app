import { matchesSearch } from '@/shared/utils/text';

import { SHIFT_META } from './shifts';
import type { SchoolClass, Shift } from './types';

export type ShiftFilter = Shift | 'all';

export function filterClasses(
  classes: SchoolClass[],
  query: string,
  shift: ShiftFilter,
): SchoolClass[] {
  return classes.filter(
    (item) =>
      (shift === 'all' || item.shift === shift) &&
      matchesSearch(query, item.name, SHIFT_META[item.shift].label, String(item.schoolYear)),
  );
}
