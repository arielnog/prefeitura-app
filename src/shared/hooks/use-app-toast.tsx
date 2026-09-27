import { useCallback, useMemo } from 'react';

import { useToast } from '@/components/ui/toast';
import { FeedbackToast, type FeedbackType } from '@/shared/components/feedback-toast';

const DURATION = { success: 3000, error: 5000 } as const;

export function useAppToast() {
  const toast = useToast();

  const show = useCallback(
    (type: FeedbackType, message: string) => {
      toast.show({
        placement: 'bottom',
        duration: DURATION[type],
        render: ({ id }) => (
          <FeedbackToast
            id={id}
            type={type}
            message={message}
            duration={DURATION[type]}
            onClose={() => toast.close(id)}
          />
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
