import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';

import { SHIFT_META } from '../shifts';
import type { Shift } from '../types';

export function ShiftBadge({ shift }: { shift: Shift }) {
  const { label, icon, tone } = SHIFT_META[shift];

  return (
    <HStack className={`items-center gap-1 self-start rounded-full px-2.5 py-1 ${tone}`}>
      <Icon as={icon} size="xs" className={tone} />
      <Text size="xs" bold className={tone}>
        {label}
      </Text>
    </HStack>
  );
}
