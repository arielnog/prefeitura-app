import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { getErrorMessage } from '@/shared/api/api-error';
import { persistStorage } from '@/shared/store/persist-storage';
import type { RequestStatus } from '@/shared/store/types';

import { schoolRepository, type SchoolRepository } from '../api/school-repository';
import type { School, SchoolInput } from '../types';

export interface SchoolState {
  schools: School[];
  status: RequestStatus;
  error: string | null;
  fetchSchools: () => Promise<void>;
  createSchool: (input: SchoolInput) => Promise<School>;
  updateSchool: (id: string, input: SchoolInput) => Promise<School>;
  deleteSchool: (id: string) => Promise<void>;
  /** Mantém `classIds` em sincronia quando o módulo de turmas altera os vínculos. */
  setClassIds: (schoolId: string, classIds: string[]) => void;
}

const byName = (a: School, b: School) => a.name.localeCompare(b.name, 'pt-BR');

const replace = (schools: School[], school: School) =>
  schools.map((item) => (item.id === school.id ? school : item));

interface StoreOptions {
  /** Desliga a leitura do cache persistido (útil em testes). */
  skipHydration?: boolean;
}

export const createSchoolStore = (
  repository: SchoolRepository,
  { skipHydration }: StoreOptions = {},
) =>
  create<SchoolState>()(
    persist(
      (set) => ({
        schools: [],
        status: 'idle',
        error: null,

        fetchSchools: async () => {
          set({ status: 'loading', error: null });
          try {
            const schools = await repository.list();
            set({ schools: schools.sort(byName), status: 'success' });
          } catch (error) {
            set({ status: 'error', error: getErrorMessage(error) });
          }
        },

        createSchool: async (input) => {
          const school = await repository.create(input);
          set((state) => ({ schools: [...state.schools, school].sort(byName) }));
          return school;
        },

        updateSchool: async (id, input) => {
          const school = await repository.update(id, input);
          set((state) => ({ schools: replace(state.schools, school).sort(byName) }));
          return school;
        },

        deleteSchool: async (id) => {
          await repository.remove(id);
          set((state) => ({ schools: state.schools.filter((school) => school.id !== id) }));
        },

        setClassIds: (schoolId, classIds) =>
          set((state) => ({
            schools: state.schools.map((school) =>
              school.id === schoolId ? { ...school, classIds } : school,
            ),
          })),
      }),
      {
        name: 'prefeitura:schools',
        storage: persistStorage,
        partialize: (state) => ({ schools: state.schools }),
        skipHydration,
      },
    ),
  );

export const useSchoolStore = createSchoolStore(schoolRepository);
