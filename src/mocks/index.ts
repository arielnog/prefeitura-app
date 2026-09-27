import type { Server } from 'miragejs';

import { env } from '@/shared/config/env';

import { clearSnapshot, loadSnapshot, saveSnapshot } from './persistence';
import { makeServer } from './server';

const globalRef = globalThis as typeof globalThis & { __mockServer?: Server };

/**
 * Sobe o back-end simulado (MirageJS) dentro do próprio app.
 * O estado do banco é salvo no AsyncStorage a cada escrita, então os dados sobrevivem a reloads.
 */
export async function startMockServer(): Promise<void> {
  globalRef.__mockServer?.shutdown();

  const snapshot = await loadSnapshot().catch(() => null);

  globalRef.__mockServer = makeServer({
    urlPrefix: env.apiUrl,
    snapshot,
    onChange: (data) => void saveSnapshot(data),
  });
}

/** Descarta os dados salvos e volta ao seed inicial. */
export async function resetMockServer(): Promise<void> {
  await clearSnapshot();
  await startMockServer();
}
