import { router, useLocalSearchParams } from 'expo-router';

import { ClassForm } from '@/features/classes/components/class-form';

export function NewClassScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <ClassForm schoolId={id} onSaved={() => router.back()} />;
}
