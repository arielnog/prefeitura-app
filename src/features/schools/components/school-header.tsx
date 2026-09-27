import { MapPin, Pencil, Trash2, Users } from 'lucide-react-native';

import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { pluralize } from '@/shared/utils/text';

import type { School } from '../types';
import { SchoolAvatar } from './school-avatar';

interface SchoolHeaderProps {
  school: School;
  onEdit: () => void;
  onDelete: () => void;
}

export function SchoolHeader({ school, onEdit, onDelete }: SchoolHeaderProps) {
  return (
    <VStack className="gap-4 rounded-2xl border border-border bg-card p-5">
      <HStack className="items-center gap-4">
        <SchoolAvatar name={school.name} size="lg" />
        <VStack className="flex-1 gap-1">
          <Heading size="lg" className="text-foreground">
            {school.name}
          </Heading>
          <HStack className="items-center gap-1">
            <Icon as={MapPin} size="sm" className="text-muted-foreground" />
            <Text size="sm" className="flex-1 text-muted-foreground">
              {school.address}
            </Text>
          </HStack>
          <HStack className="items-center gap-1">
            <Icon as={Users} size="sm" className="text-muted-foreground" />
            <Text size="sm" className="text-muted-foreground">
              {pluralize(school.classIds.length, 'turma', 'turmas')}
            </Text>
          </HStack>
        </VStack>
      </HStack>
      <HStack className="gap-2">
        <Button variant="outline" className="flex-1 rounded-xl" onPress={onEdit}>
          <ButtonIcon as={Pencil} />
          <ButtonText>Editar</ButtonText>
        </Button>
        <Button variant="outline" className="flex-1 rounded-xl" onPress={onDelete}>
          <ButtonIcon as={Trash2} className="text-destructive" />
          <ButtonText className="text-destructive">Excluir</ButtonText>
        </Button>
      </HStack>
    </VStack>
  );
}
