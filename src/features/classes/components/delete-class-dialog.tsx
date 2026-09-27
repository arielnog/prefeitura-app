import { ConfirmDialog } from '@/shared/components/confirm-dialog';

import type { SchoolClass } from '../types';

interface DeleteClassDialogProps {
  schoolClass: SchoolClass | null;
  isDeleting: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function DeleteClassDialog({
  schoolClass,
  isDeleting,
  onConfirm,
  onClose,
}: DeleteClassDialogProps) {
  return (
    <ConfirmDialog
      isOpen={Boolean(schoolClass)}
      title="Excluir turma?"
      description={`"${schoolClass?.name}" será removida permanentemente.`}
      isLoading={isDeleting}
      onConfirm={onConfirm}
      onClose={onClose}
    />
  );
}
