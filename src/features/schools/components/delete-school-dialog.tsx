import { ConfirmDialog } from '@/shared/components/confirm-dialog';

import type { School } from '../types';

interface DeleteSchoolDialogProps {
  school: School | null;
  isDeleting: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function DeleteSchoolDialog({
  school,
  isDeleting,
  onConfirm,
  onClose,
}: DeleteSchoolDialogProps) {
  const classCount = school?.classIds.length ?? 0;
  const cascade =
    classCount > 0 ? ` As ${classCount} turmas vinculadas também serão excluídas.` : '';

  return (
    <ConfirmDialog
      isOpen={Boolean(school)}
      title="Excluir escola?"
      description={`"${school?.name}" será removida permanentemente.${cascade}`}
      isLoading={isDeleting}
      onConfirm={onConfirm}
      onClose={onClose}
    />
  );
}
