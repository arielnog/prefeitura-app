import { useCallback, useEffect, useRef, useState } from 'react';

import { ApiError, getErrorMessage } from '@/shared/api/api-error';

import { useSchoolStore } from '../store/school-store';

type Lookup = { status: 'idle' } | { status: 'error'; message: string | null };

export function useSchool(id: string | undefined) {
  const school = useSchoolStore((state) => state.schools.find((item) => item.id === id));
  const fetchSchool = useSchoolStore((state) => state.fetchSchool);
  const [lookup, setLookup] = useState<Lookup>({ status: 'idle' });
  const handledId = useRef<string | undefined>(undefined);

  const load = useCallback(
    (schoolId: string) => {
      fetchSchool(schoolId)
        .then(() => setLookup({ status: 'idle' }))
        .catch((error: unknown) =>
          setLookup({
            status: 'error',
            message: error instanceof ApiError && error.isNotFound ? null : getErrorMessage(error),
          }),
        );
    },
    [fetchSchool],
  );

  useEffect(() => {
    if (!id || handledId.current === id) return;
    handledId.current = id;
    if (!school) load(id);
  }, [id, school, load]);

  return {
    school,
    isLoading: !school && lookup.status !== 'error',
    error: !school && lookup.status === 'error' ? lookup.message : null,
    isNotFound: !school && lookup.status === 'error' && lookup.message === null,
    retry: useCallback(() => {
      if (!id) return;
      setLookup({ status: 'idle' });
      load(id);
    }, [id, load]),
  };
}
