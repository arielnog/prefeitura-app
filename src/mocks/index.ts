import type { Server } from 'miragejs';

import { env } from '@/shared/config/env';

import { loadSnapshot, saveSnapshot } from './persistence';
import { makeServer } from './server';

const globalRef = globalThis as typeof globalThis & { __mockServer?: Server };

export async function startMockServer(): Promise<void> {
  globalRef.__mockServer?.shutdown();

  const snapshot = await loadSnapshot().catch(() => null);

  globalRef.__mockServer = makeServer({
    urlPrefix: env.apiUrl,
    snapshot,
    onChange: (data) => void saveSnapshot(data),
  });
}
