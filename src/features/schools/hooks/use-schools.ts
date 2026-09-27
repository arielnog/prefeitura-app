import { useCallback, useEffect, useMemo, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useDebouncedValue } from '@/shared/hooks/use-debounced-value';

import { filterSchools, type SchoolFilter } from '../filters';
import { useSchoolStore } from '../store/school-store';

export function useSchools() {
  const { schools, status, error, fetchSchools } = useSchoolStore(
    useShallow(({ schools, status, error, fetchSchools }) => ({
      schools,
      status,
      error,
      fetchSchools,
    })),
  );
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<SchoolFilter>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const debouncedQuery = useDebouncedValue(query);

  useEffect(() => {
    fetchSchools();
  }, [fetchSchools]);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchSchools();
    setIsRefreshing(false);
  }, [fetchSchools]);

  const visibleSchools = useMemo(
    () => filterSchools(schools, debouncedQuery, filter),
    [schools, debouncedQuery, filter],
  );

  const totalClasses = useMemo(
    () => schools.reduce((total, school) => total + school.classIds.length, 0),
    [schools],
  );

  return {
    schools: visibleSchools,
    totalSchools: schools.length,
    totalClasses,
    query,
    setQuery,
    filter,
    setFilter,
    isFiltering: debouncedQuery.trim().length > 0 || filter !== 'all',
    isInitialLoading: status === 'loading' && schools.length === 0 && !isRefreshing,
    isRefreshing,
    error: schools.length === 0 ? error : null,
    refresh,
  };
}
