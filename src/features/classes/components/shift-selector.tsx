import { View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';

import { SHIFT_META, SHIFTS } from '../shifts';
import type { Shift } from '../types';

interface ShiftSelectorProps {
  value: Shift | undefined;
  onChange: (shift: Shift) => void;
}

export function ShiftSelector({ value, onChange }: ShiftSelectorProps) {
  return (
    <View className="flex-row flex-wrap gap-2" accessibilityRole="radiogroup">
      {SHIFTS.map((shift) => {
        const { label, icon } = SHIFT_META[shift];
        const selected = value === shift;

        return (
          <Pressable
            key={shift}
            onPress={() => onChange(shift)}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
            accessibilityLabel={label}
            className={`min-w-[47%] flex-1 flex-row items-center justify-center gap-2 rounded-xl border px-3 py-3 ${
              selected ? 'border-primary bg-accent' : 'border-border bg-card'
            }`}
          >
            <Icon
              as={icon}
              size="md"
              className={selected ? 'text-accent-foreground' : 'text-muted-foreground'}
            />
            <Text
              size="sm"
              className={selected ? 'font-semibold text-accent-foreground' : 'text-foreground'}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
