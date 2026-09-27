import { MapPin, Pencil, Trash2, Users } from 'lucide-react-native';

import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { IconButton } from '@/shared/components/icon-button';
import { pluralize } from '@/shared/utils/text';

import type { School } from '../types';
import { SchoolAvatar } from './school-avatar';

interface SchoolCardProps {
  school: School;
  onPress: (school: School) => void;
  onEdit: (school: School) => void;
  onDelete: (school: School) => void;
}

export function SchoolCard({ school, onPress, onEdit, onDelete }: SchoolCardProps) {
  const classCount = pluralize(school.classIds.length, 'turma', 'turmas');

  return (
    <Pressable
      onPress={() => onPress(school)}
      accessibilityRole="button"
      accessibilityLabel={`${school.name}, ${school.address}, ${classCount}`}
      className="flex-1 rounded-2xl border border-border bg-card p-4 data-[active=true]:opacity-80"
    >
      <HStack className="items-start gap-3">
        <SchoolAvatar name={school.name} />
        <VStack className="flex-1 gap-1">
          <Text bold size="md" numberOfLines={2} className="text-foreground">
            {school.name}
          </Text>
          <HStack className="items-center gap-1">
            <Icon as={MapPin} size="xs" className="text-muted-foreground" />
            <Text size="sm" numberOfLines={1} className="flex-1 text-muted-foreground">
              {school.address}
            </Text>
          </HStack>
          <HStack className="mt-2 items-center gap-1 self-start rounded-full bg-secondary px-2.5 py-1">
            <Icon as={Users} size="xs" className="text-secondary-foreground" />
            <Text size="xs" bold className="text-secondary-foreground">
              {classCount}
            </Text>
          </HStack>
        </VStack>
        <HStack className="-mr-2 -mt-2">
          <IconButton
            icon={Pencil}
            label={`Editar ${school.name}`}
            onPress={() => onEdit(school)}
          />
          <IconButton
            icon={Trash2}
            tone="destructive"
            label={`Excluir ${school.name}`}
            onPress={() => onDelete(school)}
          />
        </HStack>
      </HStack>
    </Pressable>
  );
}
