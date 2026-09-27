import { useCallback, useEffect, useRef, useState } from 'react';

import { ApiError, getErrorMessage } from '@/shared/api/api-error';

import { useSchoolStore } from '../store/school-store';

// Sem escola no store e sem erro = carregando.
type Lookup = { status: 'idle' } | { status: 'error'; message: string | null };

/**
 * Escola pelo id. Usa o store e, se ela ainda não estiver carregada (deep link, cache vazio),
 * busca na API uma única vez por id.
 */
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
            // 404 = a escola não existe; demais erros permitem tentar de novo.
            message: error instanceof ApiError && error.isNotFound ? null : getErrorMessage(error),
          }),
        );
    },
    [fetchSchool],
  );

  useEffect(() => {
    if (!id || handledId.current === id) return;
    // Uma escola que já estava no store não é buscada de novo (ex.: após ser excluída).
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
