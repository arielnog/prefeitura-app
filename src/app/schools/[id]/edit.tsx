import { router, useLocalSearchParams } from 'expo-router';
import { SearchX } from 'lucide-react-native';

import { SchoolForm } from '@/features/schools/components/school-form';
import { useSchool } from '@/features/schools/hooks/use-school';
import { EmptyState } from '@/shared/components/empty-state';

export default function EditSchoolScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const school = useSchool(id);

  if (!school) {
    return <EmptyState icon={SearchX} title="Escola não encontrada" />;
  }

  return <SchoolForm school={school} onSaved={() => router.back()} />;
}
