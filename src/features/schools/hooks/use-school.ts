import { useSchoolStore } from '../store/school-store';

export const useSchool = (id: string | undefined) =>
  useSchoolStore((state) => state.schools.find((school) => school.id === id));
