import { useEffect, useState } from 'react';

import { env } from '@/shared/config/env';

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
