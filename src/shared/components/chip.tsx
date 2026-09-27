import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';

interface ChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export function Chip({ label, selected, onPress }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      className={`rounded-full border px-4 py-2 ${
        selected ? 'border-primary bg-primary' : 'border-border bg-card'
      }`}
    >
      <Text
        size="sm"
        className={selected ? 'font-semibold text-primary-foreground' : 'text-foreground'}
      >
        {label}
      </Text>
    </Pressable>
  );
}
