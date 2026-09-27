import { useCallback, useState } from 'react';

import { getErrorMessage } from '@/shared/api/api-error';
import { useAppToast } from '@/shared/hooks/use-app-toast';

import { useClassStore } from '../store/class-store';
import type { SchoolClass } from '../types';

export function useDeleteClass(onDeleted?: () => void) {
  const deleteClass = useClassStore((state) => state.deleteClass);
  const toast = useAppToast();
  const [target, setTarget] = useState<SchoolClass | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirm = useCallback(async () => {
    if (!target) return;
    setIsDeleting(true);
    try {
      await deleteClass(target);
      toast.success('Turma excluída');
      setTarget(null);
      onDeleted?.();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  }, [target, deleteClass, toast, onDeleted]);

  return {
    target,
    isDeleting,
    request: setTarget,
    cancel: useCallback(() => setTarget(null), []),
    confirm,
  };
}
