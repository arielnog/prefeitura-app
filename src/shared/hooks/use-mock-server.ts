import { useEffect, useState } from 'react';

import { env } from '@/shared/config/env';

/** Inicializa o back-end simulado quando habilitado. Retorna `true` quando o app pode renderizar. */
export function useMockServer(): boolean {
  const [ready, setReady] = useState(!env.useMock);

  useEffect(() => {
    if (!env.useMock) return;

    import('@/mocks')
      .then(({ startMockServer }) => startMockServer())
      .finally(() => setReady(true));
  }, []);

  return ready;
}
