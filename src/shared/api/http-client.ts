import { env } from '@/shared/config/env';

import { ApiError, type FieldErrors } from './api-error';

type QueryParams = Record<string, string | number | undefined>;

export interface HttpClient {
  get<T>(path: string, params?: QueryParams): Promise<T>;
  post<T>(path: string, body: unknown): Promise<T>;
  put<T>(path: string, body: unknown): Promise<T>;
  delete(path: string): Promise<void>;
}

interface ErrorBody {
  message?: string;
  errors?: FieldErrors;
}

const buildQuery = (params?: QueryParams) => {
  const entries = Object.entries(params ?? {}).filter(([, value]) => value !== undefined);
  return entries.length ? `?${new URLSearchParams(entries as [string, string][]).toString()}` : '';
};

export class FetchHttpClient implements HttpClient {
  constructor(private readonly baseUrl: string) {}

  get<T>(path: string, params?: QueryParams) {
    return this.request<T>('GET', `${path}${buildQuery(params)}`);
  }

  post<T>(path: string, body: unknown) {
    return this.request<T>('POST', path, body);
  }

  put<T>(path: string, body: unknown) {
    return this.request<T>('PUT', path, body);
  }

  async delete(path: string) {
    await this.request<void>('DELETE', path);
  }

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    let response: Response;
    try {
      response = await fetch(`${this.baseUrl}${path}`, {
        method,
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
    } catch {
      throw new ApiError('Não foi possível conectar ao servidor.', 0);
    }

    const text = await response.text();
    const data = parseJson(text);

    if (!response.ok) {
      const { message, errors } = (data ?? {}) as ErrorBody;
      throw new ApiError(
        message ?? `O servidor não conseguiu atender a solicitação (erro ${response.status}).`,
        response.status,
        errors,
      );
    }

    if (text && data === undefined) {
      throw new ApiError('O servidor retornou uma resposta inválida.', response.status);
    }

    return data as T;
  }
}

function parseJson(text: string): unknown {
  if (!text) return undefined;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return undefined;
  }
}

export const httpClient: HttpClient = new FetchHttpClient(`${env.apiUrl}/api`);
