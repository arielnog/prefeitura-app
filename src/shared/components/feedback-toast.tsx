import { CircleAlert, CircleCheck } from 'lucide-react-native';
import Animated, { FadeOutDown, SlideInDown } from 'react-native-reanimated';

import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

export type FeedbackType = 'success' | 'error';

const VARIANTS = {
  success: { title: 'Tudo certo', icon: CircleCheck, className: 'bg-emerald-600' },
  error: { title: 'Algo deu errado', icon: CircleAlert, className: 'bg-red-600' },
} as const;

/** Espaço reservado para o toast não cobrir o FAB no canto inferior. */
const FAB_CLEARANCE = 88;

interface FeedbackToastProps {
  id: string;
  type: FeedbackType;
  message: string;
}

export function FeedbackToast({ id, type, message }: FeedbackToastProps) {
  const variant = VARIANTS[type];

  return (
    <Animated.View
      nativeID={`toast-${id}`}
      entering={SlideInDown.springify().damping(18)}
      exiting={FadeOutDown.duration(200)}
      style={{ marginBottom: FAB_CLEARANCE }}
      className="w-full max-w-md px-4"
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <HStack className={`items-center gap-3 rounded-2xl px-4 py-4 shadow-lg ${variant.className}`}>
        <Icon as={variant.icon} size="xl" className="text-white" />
        <VStack className="flex-1">
          <Text bold size="md" className="text-white">
            {variant.title}
          </Text>
          <Text size="sm" className="text-white/90">
            {message}
          </Text>
        </VStack>
      </HStack>
    </Animated.View>
  );
}
