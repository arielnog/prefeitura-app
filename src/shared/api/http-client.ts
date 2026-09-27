import { env } from '@/shared/config/env';

import { ApiError, type FieldErrors } from './api-error';

type QueryParams = Record<string, string | number | undefined>;

/** Contrato mínimo de transporte HTTP usado pelos repositórios. */
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

/** Adapter sobre a Fetch API: centraliza base URL, JSON e tradução de erros em `ApiError`. */
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
    const data = text ? (JSON.parse(text) as unknown) : undefined;

    if (!response.ok) {
      const { message, errors } = (data ?? {}) as ErrorBody;
      throw new ApiError(message ?? `Erro ${response.status}`, response.status, errors);
    }

    return data as T;
  }
}

export const httpClient: HttpClient = new FetchHttpClient(`${env.apiUrl}/api`);
