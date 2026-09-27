import type { LucideIcon } from 'lucide-react-native';

import { Icon } from '@/components/ui/icon';
import { Pressable } from '@/components/ui/pressable';

interface IconButtonProps {
  icon: LucideIcon;
  label: string;
  onPress: () => void;
  tone?: 'default' | 'destructive';
}

export function IconButton({ icon, label, onPress, tone = 'default' }: IconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={6}
      className="h-10 w-10 items-center justify-center rounded-full data-[active=true]:bg-accent"
    >
      <Icon
        as={icon}
        size="lg"
        className={tone === 'destructive' ? 'text-destructive' : 'text-muted-foreground'}
      />
    </Pressable>
  );
}
