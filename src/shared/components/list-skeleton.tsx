import { View } from 'react-native';

import { HStack } from '@/components/ui/hstack';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';
import { VStack } from '@/components/ui/vstack';

export function ListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <View className="gap-3" accessibilityLabel="Carregando">
      {Array.from({ length: count }, (_, index) => (
        <HStack key={index} className="items-center gap-3 rounded-2xl bg-card p-4">
          <Skeleton variant="circular" className="h-12 w-12" />
          <VStack className="flex-1 gap-2">
            <SkeletonText _lines={2} className="h-3" />
          </VStack>
        </HStack>
      ))}
    </View>
  );
}
