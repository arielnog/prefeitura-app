import type { LucideIcon } from 'lucide-react-native';

import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: { label: string; onPress: () => void };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <VStack className="items-center gap-3 px-8 py-16">
      <VStack className="h-16 w-16 items-center justify-center rounded-full bg-accent">
        <Icon as={icon} size="xl" className="text-accent-foreground" />
      </VStack>
      <Heading size="md" className="text-center text-foreground">
        {title}
      </Heading>
      {description ? (
        <Text size="sm" className="text-center text-muted-foreground">
          {description}
        </Text>
      ) : null}
      {action ? (
        <Button variant="outline" className="mt-2" onPress={action.onPress}>
          <ButtonText>{action.label}</ButtonText>
        </Button>
      ) : null}
    </VStack>
  );
}
