import { CalendarDays, Pencil, Trash2 } from 'lucide-react-native';

import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { IconButton } from '@/shared/components/icon-button';

import { SHIFT_META } from '../shifts';
import type { SchoolClass } from '../types';
import { ShiftBadge } from './shift-badge';

interface ClassCardProps {
  schoolClass: SchoolClass;
  onEdit: (schoolClass: SchoolClass) => void;
  onDelete: (schoolClass: SchoolClass) => void;
}

export function ClassCard({ schoolClass, onEdit, onDelete }: ClassCardProps) {
  const shift = SHIFT_META[schoolClass.shift];

  return (
    <Pressable
      onPress={() => onEdit(schoolClass)}
      accessibilityRole="button"
      accessibilityLabel={`${schoolClass.name}, turno ${shift.label}, ano letivo ${schoolClass.schoolYear}`}
      accessibilityHint="Abre a edição da turma"
      className="flex-1 rounded-2xl border border-border bg-card p-4 data-[active=true]:opacity-80"
    >
      <HStack className="items-center gap-3">
        <VStack className={`h-12 w-12 items-center justify-center rounded-xl ${shift.tone}`}>
          <Icon as={shift.icon} size="lg" className={shift.tone} />
        </VStack>
        <VStack className="flex-1 gap-1.5">
          <Text bold size="md" numberOfLines={1} className="text-foreground">
            {schoolClass.name}
          </Text>
          <HStack className="flex-wrap items-center gap-2">
            <ShiftBadge shift={schoolClass.shift} />
            <HStack className="items-center gap-1">
              <Icon as={CalendarDays} size="xs" className="text-muted-foreground" />
              <Text size="xs" className="text-muted-foreground">
                {schoolClass.schoolYear}
              </Text>
            </HStack>
          </HStack>
        </VStack>
        <HStack className="-mr-2">
          <IconButton
            icon={Pencil}
            label={`Editar ${schoolClass.name}`}
            onPress={() => onEdit(schoolClass)}
          />
          <IconButton
            icon={Trash2}
            tone="destructive"
            label={`Excluir ${schoolClass.name}`}
            onPress={() => onDelete(schoolClass)}
          />
        </HStack>
      </HStack>
    </Pressable>
  );
}
