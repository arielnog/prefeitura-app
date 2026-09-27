import { useClassStore } from '../store/class-store';

export const useSchoolClass = (schoolId: string | undefined, classId: string | undefined) =>
  useClassStore((state) =>
    schoolId ? state.classesBySchool[schoolId]?.find((item) => item.id === classId) : undefined,
  );
