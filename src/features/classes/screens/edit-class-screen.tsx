import { router, useLocalSearchParams } from 'expo-router';

import { ClassForm } from '@/features/classes/components/class-form';
import { useSchoolClass } from '@/features/classes/hooks/use-school-class';
import { ResourceFallback } from '@/shared/components/resource-fallback';

export function EditClassScreen() {
  const { id, classId } = useLocalSearchParams<{ id: string; classId: string }>();
  const { schoolClass, isLoading, error, retry } = useSchoolClass(id, classId);

  if (!schoolClass) {
    return (
      <ResourceFallback resource="Turma" isLoading={isLoading} error={error} onRetry={retry} />
    );
  }

  return <ClassForm schoolId={id} schoolClass={schoolClass} onSaved={() => router.back()} />;
}
