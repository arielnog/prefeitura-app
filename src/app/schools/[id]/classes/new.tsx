import { router, useLocalSearchParams } from 'expo-router';

import { ClassForm } from '@/features/classes/components/class-form';

export default function NewClassScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <ClassForm schoolId={id} onSaved={() => router.back()} />;
}
