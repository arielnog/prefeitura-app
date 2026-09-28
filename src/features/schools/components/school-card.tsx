import { MapPin, Pencil, Trash2, Users } from 'lucide-react-native';
import { View } from 'react-native';

import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { ClampedText } from '@/shared/components/clamped-text';
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

  // Área principal e ações são irmãs (não aninhadas): botões dentro de botão são HTML
  // inválido no web e ficam inacessíveis ao leitor de tela no celular.
  return (
    <View className="flex-1 flex-row items-start rounded-2xl border border-border bg-card">
      <Pressable
        onPress={() => onPress(school)}
        accessibilityRole="button"
        accessibilityLabel={`${school.name}, ${school.address}, ${classCount}`}
        className="flex-1 flex-row items-start gap-3 rounded-2xl py-4 pl-4 data-[active=true]:opacity-70"
      >
        <SchoolAvatar name={school.name} />
        <VStack className="flex-1 gap-1">
          <ClampedText lines={2} className="text-base font-bold text-foreground">
            {school.name}
          </ClampedText>
          <HStack className="items-center gap-1">
            <Icon as={MapPin} size="xs" className="text-muted-foreground" />
            <ClampedText lines={1} className="flex-1 text-sm text-muted-foreground">
              {school.address}
            </ClampedText>
          </HStack>
          <HStack className="mt-2 items-center gap-1 self-start rounded-full bg-secondary px-2.5 py-1">
            <Icon as={Users} size="xs" className="text-secondary-foreground" />
            <Text size="xs" bold className="text-secondary-foreground">
              {classCount}
            </Text>
          </HStack>
        </VStack>
      </Pressable>
      <HStack className="p-2">
        <IconButton icon={Pencil} label={`Editar ${school.name}`} onPress={() => onEdit(school)} />
        <IconButton
          icon={Trash2}
          tone="destructive"
          label={`Excluir ${school.name}`}
          onPress={() => onDelete(school)}
        />
      </HStack>
    </View>
  );
}
