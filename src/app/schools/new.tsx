import { router } from 'expo-router';

import { SchoolForm } from '@/features/schools/components/school-form';

export default function NewSchoolScreen() {
  return <SchoolForm onSaved={() => router.back()} />;
}
