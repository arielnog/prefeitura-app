import { router, useLocalSearchParams } from 'expo-router';

import { SchoolForm } from '@/features/schools/components/school-form';
import { useSchool } from '@/features/schools/hooks/use-school';
import { ResourceFallback } from '@/shared/components/resource-fallback';

export default function EditSchoolScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { school, isLoading, error, retry } = useSchool(id);

  if (!school) {
    return (
      <ResourceFallback resource="Escola" isLoading={isLoading} error={error} onRetry={retry} />
    );
  }

  return <SchoolForm school={school} onSaved={() => router.back()} />;
}
