import { httpClient, type HttpClient } from '@/shared/api/http-client';

import type { School, SchoolInput } from '../types';

export interface SchoolRepository {
  list(): Promise<School[]>;
  get(id: string): Promise<School>;
  create(input: SchoolInput): Promise<School>;
  update(id: string, input: SchoolInput): Promise<School>;
  remove(id: string): Promise<void>;
}

export class HttpSchoolRepository implements SchoolRepository {
  constructor(private readonly http: HttpClient) {}

  list() {
    return this.http.get<School[]>('/schools');
  }

  get(id: string) {
    return this.http.get<School>(`/schools/${id}`);
  }

  create(input: SchoolInput) {
    return this.http.post<School>('/schools', input);
  }

  update(id: string, input: SchoolInput) {
    return this.http.put<School>(`/schools/${id}`, input);
  }

  remove(id: string) {
    return this.http.delete(`/schools/${id}`);
  }
}

export const schoolRepository: SchoolRepository = new HttpSchoolRepository(httpClient);
