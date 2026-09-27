import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { initials } from '@/shared/utils/text';

export function SchoolAvatar({ name, size = 'md' }: { name: string; size?: 'md' | 'lg' }) {
  const box = size === 'lg' ? 'h-16 w-16 rounded-2xl' : 'h-12 w-12 rounded-xl';

  return (
    <VStack className={`${box} items-center justify-center bg-accent`}>
      <Text bold size={size === 'lg' ? 'xl' : 'md'} className="text-accent-foreground">
        {initials(name)}
      </Text>
    </VStack>
  );
}
