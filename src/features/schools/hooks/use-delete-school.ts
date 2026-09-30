import { useCallback, useState } from 'react';

import { getErrorMessage } from '@/shared/api/api-error';
import { useAppToast } from '@/shared/hooks/use-app-toast';

import { useSchoolStore } from '../store/school-store';
import type { School } from '../types';

export function useDeleteSchool(onDeleted?: () => void) {
  const deleteSchool = useSchoolStore((state) => state.deleteSchool);
  const toast = useAppToast();
  const [target, setTarget] = useState<School | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirm = useCallback(async () => {
    if (!target) return;
    setIsDeleting(true);
    try {
      await deleteSchool(target.id);
      toast.success('Escola excluída');
      setTarget(null);
      onDeleted?.();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  }, [target, deleteSchool, toast, onDeleted]);

  return {
    target,
    isDeleting,
    request: setTarget,
    cancel: useCallback(() => setTarget(null), []),
    confirm,
  };
}
