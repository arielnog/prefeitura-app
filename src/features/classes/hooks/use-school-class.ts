import { useCallback, useEffect } from 'react';

import { useClassStore } from '../store/class-store';

export function useSchoolClass(schoolId: string | undefined, classId: string | undefined) {
  const schoolClass = useClassStore((state) =>
    schoolId ? state.classesBySchool[schoolId]?.find((item) => item.id === classId) : undefined,
  );
  const status = useClassStore((state) =>
    schoolId ? (state.statusBySchool[schoolId] ?? 'idle') : 'idle',
  );
  const error = useClassStore((state) =>
    schoolId ? (state.errorBySchool[schoolId] ?? null) : null,
  );
  const fetchClasses = useClassStore((state) => state.fetchClasses);

  useEffect(() => {
    if (schoolId && !schoolClass && status === 'idle') fetchClasses(schoolId);
  }, [schoolId, schoolClass, status, fetchClasses]);

  return {
    schoolClass,
    isLoading: !schoolClass && (status === 'idle' || status === 'loading'),
    error: !schoolClass && status === 'error' ? error : null,
    retry: useCallback(() => {
      if (schoolId) fetchClasses(schoolId);
    }, [schoolId, fetchClasses]),
  };
}
