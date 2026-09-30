import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { useSchoolStore } from '@/features/schools/store/school-store';
import { getErrorMessage } from '@/shared/api/api-error';
import { persistStorage } from '@/shared/store/persist-storage';
import type { RequestStatus } from '@/shared/store/types';

import { classRepository, type ClassRepository } from '../api/class-repository';
import type { CreateSchoolClassInput, SchoolClass, SchoolClassInput } from '../types';

export interface ClassState {
  classesBySchool: Record<string, SchoolClass[]>;
  statusBySchool: Record<string, RequestStatus>;
  errorBySchool: Record<string, string | null>;
  fetchClasses: (schoolId: string) => Promise<void>;
  createClass: (input: CreateSchoolClassInput) => Promise<SchoolClass>;
  updateClass: (schoolClass: SchoolClass, input: SchoolClassInput) => Promise<SchoolClass>;
  deleteClass: (schoolClass: SchoolClass) => Promise<void>;
  removeSchoolClasses: (schoolId: string) => void;
}

interface ClassStoreOptions {
  onClassIdsChange?: (schoolId: string, classIds: string[]) => void;
  skipHydration?: boolean;
}

const byName = (a: SchoolClass, b: SchoolClass) =>
  a.name.localeCompare(b.name, 'pt-BR', { numeric: true });

export const createClassStore = (
  repository: ClassRepository,
  { onClassIdsChange, skipHydration }: ClassStoreOptions = {},
) =>
  create<ClassState>()(
    persist(
      (set, get) => {
        const setSchoolClasses = (schoolId: string, classes: SchoolClass[]) => {
          const sorted = [...classes].sort(byName);
          set((state) => ({ classesBySchool: { ...state.classesBySchool, [schoolId]: sorted } }));
          onClassIdsChange?.(
            schoolId,
            sorted.map((item) => item.id),
          );
        };

        const classesOf = (schoolId: string) => get().classesBySchool[schoolId] ?? [];

        return {
          classesBySchool: {},
          statusBySchool: {},
          errorBySchool: {},

          fetchClasses: async (schoolId) => {
            set((state) => ({
              statusBySchool: { ...state.statusBySchool, [schoolId]: 'loading' },
              errorBySchool: { ...state.errorBySchool, [schoolId]: null },
            }));
            try {
              setSchoolClasses(schoolId, await repository.listBySchool(schoolId));
              set((state) => ({
                statusBySchool: { ...state.statusBySchool, [schoolId]: 'success' },
              }));
            } catch (error) {
              set((state) => ({
                statusBySchool: { ...state.statusBySchool, [schoolId]: 'error' },
                errorBySchool: { ...state.errorBySchool, [schoolId]: getErrorMessage(error) },
              }));
            }
          },

          createClass: async (input) => {
            const created = await repository.create(input);
            setSchoolClasses(input.schoolId, [...classesOf(input.schoolId), created]);
            return created;
          },

          updateClass: async (schoolClass, input) => {
            const updated = await repository.update(schoolClass.id, input);
            setSchoolClasses(
              schoolClass.schoolId,
              classesOf(schoolClass.schoolId).map((item) =>
                item.id === updated.id ? updated : item,
              ),
            );
            return updated;
          },

          removeSchoolClasses: (schoolId) =>
            set((state) => {
              const { [schoolId]: _classes, ...classesBySchool } = state.classesBySchool;
              const { [schoolId]: _status, ...statusBySchool } = state.statusBySchool;
              const { [schoolId]: _error, ...errorBySchool } = state.errorBySchool;
              return { classesBySchool, statusBySchool, errorBySchool };
            }),

          deleteClass: async (schoolClass) => {
            await repository.remove(schoolClass.id);
            setSchoolClasses(
              schoolClass.schoolId,
              classesOf(schoolClass.schoolId).filter((item) => item.id !== schoolClass.id),
            );
          },
        };
      },
      {
        name: 'prefeitura:classes',
        storage: persistStorage,
        partialize: (state) => ({ classesBySchool: state.classesBySchool }),
        skipHydration,
      },
    ),
  );

type ClassStore = ReturnType<typeof createClassStore>;
type SchoolStore = typeof useSchoolStore;

export function pruneClassesOfRemovedSchools(classStore: ClassStore, schoolStore: SchoolStore) {
  return schoolStore.subscribe((state, previous) => {
    const remaining = new Set(state.schools.map((school) => school.id));
    previous.schools
      .filter((school) => !remaining.has(school.id))
      .forEach((school) => classStore.getState().removeSchoolClasses(school.id));
  });
}

export const useClassStore = createClassStore(classRepository, {
  onClassIdsChange: (schoolId, classIds) =>
    useSchoolStore.getState().setClassIds(schoolId, classIds),
});

pruneClassesOfRemovedSchools(useClassStore, useSchoolStore);
