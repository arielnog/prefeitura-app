import { Minus, Plus } from 'lucide-react-native';
import { View } from 'react-native';

import { Text } from '@/components/ui/text';
import { IconButton } from '@/shared/components/icon-button';

import { MAX_SCHOOL_YEAR, MIN_SCHOOL_YEAR } from '../schema';

interface YearStepperProps {
  value: number;
  onChange: (year: number) => void;
}

export function YearStepper({ value, onChange }: YearStepperProps) {
  const decrement = () => onChange(Math.max(MIN_SCHOOL_YEAR, value - 1));
  const increment = () => onChange(Math.min(MAX_SCHOOL_YEAR, value + 1));

  return (
    <View
      className="h-12 flex-row items-center justify-between rounded-xl border border-border bg-card px-1"
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel="Ano letivo"
      accessibilityValue={{ text: String(value) }}
      onAccessibilityAction={({ nativeEvent }) =>
        nativeEvent.actionName === 'increment' ? increment() : decrement()
      }
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
    >
      <IconButton icon={Minus} label="Ano anterior" onPress={decrement} />
      <Text bold size="lg" className="text-foreground">
        {value}
      </Text>
      <IconButton icon={Plus} label="Próximo ano" onPress={increment} />
    </View>
  );
}
