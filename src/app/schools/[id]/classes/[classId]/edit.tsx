import { router, useLocalSearchParams } from 'expo-router';
import { SearchX } from 'lucide-react-native';

import { ClassForm } from '@/features/classes/components/class-form';
import { useSchoolClass } from '@/features/classes/hooks/use-school-class';
import { EmptyState } from '@/shared/components/empty-state';

export default function EditClassScreen() {
  const { id, classId } = useLocalSearchParams<{ id: string; classId: string }>();
  const schoolClass = useSchoolClass(id, classId);

  if (!schoolClass) {
    return <EmptyState icon={SearchX} title="Turma não encontrada" />;
  }

  return <ClassForm schoolId={id} schoolClass={schoolClass} onSaved={() => router.back()} />;
}
