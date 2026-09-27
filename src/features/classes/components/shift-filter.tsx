import { ScrollView } from 'react-native';

import { Chip } from '@/shared/components/chip';

import type { ShiftFilter as ShiftFilterValue } from '../filters';
import { SHIFT_META, SHIFTS } from '../shifts';

const OPTIONS: { value: ShiftFilterValue; label: string }[] = [
  { value: 'all', label: 'Todos' },
  ...SHIFTS.map((shift) => ({ value: shift, label: SHIFT_META[shift].label })),
];

interface ShiftFilterProps {
  value: ShiftFilterValue;
  onChange: (value: ShiftFilterValue) => void;
}

export function ShiftFilter({ value, onChange }: ShiftFilterProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2">
      {OPTIONS.map((option) => (
        <Chip
          key={option.value}
          label={option.label}
          selected={value === option.value}
          onPress={() => onChange(option.value)}
        />
      ))}
    </ScrollView>
  );
}
