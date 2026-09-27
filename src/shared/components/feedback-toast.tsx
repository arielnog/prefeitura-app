import { CircleAlert, CircleCheck, X } from 'lucide-react-native';
import { useEffect } from 'react';
import { useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  FadeOutDown,
  SlideInDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

export type FeedbackType = 'success' | 'error';

const VARIANTS = {
  success: { title: 'Tudo certo!', icon: CircleCheck, background: 'bg-emerald-600' },
  error: { title: 'Algo deu errado', icon: CircleAlert, background: 'bg-red-600' },
} as const;

const MAX_WIDTH = 480;
const SIDE_GUTTER = 16;
/** Espaço reservado para o toast não cobrir o FAB no canto inferior. */
const FAB_CLEARANCE = 88;

interface FeedbackToastProps {
  id: string;
  type: FeedbackType;
  message: string;
  duration: number;
  onClose: () => void;
}

export function FeedbackToast({ id, type, message, duration, onClose }: FeedbackToastProps) {
  const variant = VARIANTS[type];
  const { width: windowWidth } = useWindowDimensions();
  // O container de toasts se ajusta ao conteúdo, então a largura precisa ser explícita.
  const width = Math.min(windowWidth - SIDE_GUTTER * 2, MAX_WIDTH);

  const progress = useSharedValue(1);
  useEffect(() => {
    progress.value = withTiming(0, { duration, easing: Easing.linear });
  }, [duration, progress]);
  const progressStyle = useAnimatedStyle(() => ({ width: `${progress.value * 100}%` }));

  return (
    <Animated.View
      nativeID={`toast-${id}`}
      entering={SlideInDown.springify().damping(18)}
      exiting={FadeOutDown.duration(200)}
      style={{ width, marginBottom: FAB_CLEARANCE }}
    >
      <VStack className={`overflow-hidden rounded-2xl shadow-lg ${variant.background}`}>
        <HStack className="items-center gap-3 py-3.5 pl-4 pr-2">
          <View className="h-10 w-10 items-center justify-center rounded-full bg-white/20">
            <Icon as={variant.icon} size="xl" className="text-white" />
          </View>
          <VStack
            className="flex-1 gap-0.5"
            accessible
            accessibilityRole="alert"
            accessibilityLiveRegion="polite"
            accessibilityLabel={`${variant.title} ${message}`}
          >
            <Text bold size="md" className="text-white">
              {variant.title}
            </Text>
            <Text size="sm" className="text-white/90">
              {message}
            </Text>
          </VStack>
          <Pressable
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Fechar aviso"
            hitSlop={8}
            className="h-10 w-10 items-center justify-center rounded-full data-[active=true]:bg-white/20"
          >
            <Icon as={X} size="lg" className="text-white" />
          </Pressable>
        </HStack>
        <Animated.View
          style={[{ height: 3, backgroundColor: 'rgba(255,255,255,0.6)' }, progressStyle]}
        />
      </VStack>
    </Animated.View>
  );
}
