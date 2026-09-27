import { useCallback, useEffect, useMemo, useState } from 'react';

import { useDebouncedValue } from '@/shared/hooks/use-debounced-value';

import { filterClasses, type ShiftFilter } from '../filters';
import { useClassStore } from '../store/class-store';
import type { SchoolClass } from '../types';

const EMPTY: SchoolClass[] = [];

export function useSchoolClasses(schoolId: string) {
  const classes = useClassStore((state) => state.classesBySchool[schoolId] ?? EMPTY);
  const status = useClassStore((state) => state.statusBySchool[schoolId] ?? 'idle');
  const error = useClassStore((state) => state.errorBySchool[schoolId] ?? null);
  const fetchClasses = useClassStore((state) => state.fetchClasses);

  const [query, setQuery] = useState('');
  const [shift, setShift] = useState<ShiftFilter>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const debouncedQuery = useDebouncedValue(query);

  useEffect(() => {
    fetchClasses(schoolId);
  }, [fetchClasses, schoolId]);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchClasses(schoolId);
    setIsRefreshing(false);
  }, [fetchClasses, schoolId]);

  const visibleClasses = useMemo(
    () => filterClasses(classes, debouncedQuery, shift),
    [classes, debouncedQuery, shift],
  );

  return {
    classes: visibleClasses,
    totalClasses: classes.length,
    query,
    setQuery,
    shift,
    setShift,
    clearFilters: useCallback(() => {
      setQuery('');
      setShift('all');
    }, []),
    isFiltering: debouncedQuery.trim().length > 0 || shift !== 'all',
    isInitialLoading: status === 'loading' && classes.length === 0 && !isRefreshing,
    isRefreshing,
    error: classes.length === 0 ? error : null,
    refresh,
  };
}
