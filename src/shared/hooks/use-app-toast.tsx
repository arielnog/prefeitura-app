import { useCallback, useMemo } from 'react';

import { Toast, ToastDescription, useToast } from '@/components/ui/toast';

type ToastAction = 'success' | 'error';

export function useAppToast() {
  const toast = useToast();

  const show = useCallback(
    (action: ToastAction, message: string) => {
      toast.show({
        placement: 'top',
        duration: 3000,
        render: ({ id }) => (
          <Toast
            nativeID={`toast-${id}`}
            action={action}
            variant="solid"
            className={action === 'success' ? 'border-emerald-500' : 'border-destructive'}
          >
            <ToastDescription>{message}</ToastDescription>
          </Toast>
        ),
      });
    },
    [toast],
  );

  return useMemo(
    () => ({
      success: (message: string) => show('success', message),
      error: (message: string) => show('error', message),
    }),
    [show],
  );
}
