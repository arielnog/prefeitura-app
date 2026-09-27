export interface School {
  id: string;
  name: string;
  address: string;
  classIds: string[];
  createdAt: string;
  updatedAt: string;
}

export type SchoolInput = Pick<School, 'name' | 'address'>;
