import { makeServer } from '@/mocks/server';
import { FetchHttpClient } from '@/shared/api/http-client';

const API_URL = 'https://api.test';

export function startMockApi() {
  const server = makeServer({ urlPrefix: API_URL, environment: 'test' });
  const http = new FetchHttpClient(`${API_URL}/api`);
  return { server, http };
}
