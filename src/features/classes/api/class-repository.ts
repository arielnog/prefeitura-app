import { httpClient, type HttpClient } from '@/shared/api/http-client';

import type { CreateSchoolClassInput, SchoolClass, SchoolClassInput } from '../types';

export interface ClassRepository {
  listBySchool(schoolId: string): Promise<SchoolClass[]>;
  create(input: CreateSchoolClassInput): Promise<SchoolClass>;
  update(id: string, input: SchoolClassInput): Promise<SchoolClass>;
  remove(id: string): Promise<void>;
}

export class HttpClassRepository implements ClassRepository {
  constructor(private readonly http: HttpClient) {}

  listBySchool(schoolId: string) {
    return this.http.get<SchoolClass[]>('/classes', { schoolId });
  }

  create(input: CreateSchoolClassInput) {
    return this.http.post<SchoolClass>('/classes', input);
  }

  update(id: string, input: SchoolClassInput) {
    return this.http.put<SchoolClass>(`/classes/${id}`, input);
  }

  remove(id: string) {
    return this.http.delete(`/classes/${id}`);
  }
}

export const classRepository: ClassRepository = new HttpClassRepository(httpClient);
