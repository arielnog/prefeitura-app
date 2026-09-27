export const SHIFTS = ['morning', 'afternoon', 'evening', 'full'] as const;

export type Shift = (typeof SHIFTS)[number];

export interface SchoolClass {
  id: string;
  schoolId: string;
  name: string;
  shift: Shift;
  schoolYear: number;
  createdAt: string;
  updatedAt: string;
}

export type SchoolClassInput = Pick<SchoolClass, 'name' | 'shift' | 'schoolYear'>;

export type CreateSchoolClassInput = SchoolClassInput & Pick<SchoolClass, 'schoolId'>;
