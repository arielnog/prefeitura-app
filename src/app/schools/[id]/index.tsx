import { router, Stack, useLocalSearchParams } from 'expo-router';
import { MapPin, Pencil, SearchX, Trash2, Users } from 'lucide-react-native';
import { ScrollView } from 'react-native';

import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { DeleteSchoolDialog } from '@/features/schools/components/delete-school-dialog';
import { SchoolAvatar } from '@/features/schools/components/school-avatar';
import { useDeleteSchool } from '@/features/schools/hooks/use-delete-school';
import { useSchool } from '@/features/schools/hooks/use-school';
import { EmptyState } from '@/shared/components/empty-state';
import { pluralize } from '@/shared/utils/text';

export default function SchoolDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const school = useSchool(id);
  const deletion = useDeleteSchool(() => router.back());

  if (!school) {
    return <EmptyState icon={SearchX} title="Escola não encontrada" />;
  }

  return (
    <>
      <Stack.Screen options={{ title: school.name }} />
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerClassName="gap-4 p-4">
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
            <Button
              variant="outline"
              className="flex-1 rounded-xl"
              onPress={() =>
                router.push({ pathname: '/schools/[id]/edit', params: { id: school.id } })
              }
            >
              <ButtonIcon as={Pencil} />
              <ButtonText>Editar</ButtonText>
            </Button>
            <Button
              variant="outline"
              className="flex-1 rounded-xl"
              onPress={() => deletion.request(school)}
            >
              <ButtonIcon as={Trash2} className="text-destructive" />
              <ButtonText className="text-destructive">Excluir</ButtonText>
            </Button>
          </HStack>
        </VStack>
      </ScrollView>
      <DeleteSchoolDialog
        school={deletion.target}
        isDeleting={deletion.isDeleting}
        onConfirm={deletion.confirm}
        onClose={deletion.cancel}
      />
    </>
  );
}
