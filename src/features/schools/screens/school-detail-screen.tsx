import { router, Stack, useLocalSearchParams } from 'expo-router';
import { BookOpen, SearchX, WifiOff } from 'lucide-react-native';
import { FlatList, RefreshControl } from 'react-native';

import { Heading } from '@/components/ui/heading';
import { VStack } from '@/components/ui/vstack';
import { ClassCard } from '@/features/classes/components/class-card';
import { DeleteClassDialog } from '@/features/classes/components/delete-class-dialog';
import { ShiftFilter } from '@/features/classes/components/shift-filter';
import { useDeleteClass } from '@/features/classes/hooks/use-delete-class';
import { useSchoolClasses } from '@/features/classes/hooks/use-school-classes';
import type { SchoolClass } from '@/features/classes/types';
import { DeleteSchoolDialog } from '@/features/schools/components/delete-school-dialog';
import { SchoolHeader } from '@/features/schools/components/school-header';
import { useDeleteSchool } from '@/features/schools/hooks/use-delete-school';
import { useSchool } from '@/features/schools/hooks/use-school';
import { AddFab } from '@/shared/components/add-fab';
import { EmptyState } from '@/shared/components/empty-state';
import { GridItem } from '@/shared/components/grid-item';
import { ListSkeleton } from '@/shared/components/list-skeleton';
import { ResourceFallback } from '@/shared/components/resource-fallback';
import { SearchBar } from '@/shared/components/search-bar';
import { useResponsive } from '@/shared/hooks/use-responsive';

export function SchoolDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { school, isLoading, error, retry } = useSchool(id);
  const classes = useSchoolClasses(id);
  const schoolDeletion = useDeleteSchool(() => router.back());
  const classDeletion = useDeleteClass();
  const { columns, horizontalPadding, itemWidth } = useResponsive();

  if (!school) {
    return (
      <ResourceFallback resource="Escola" isLoading={isLoading} error={error} onRetry={retry} />
    );
  }

  const newClass = () =>
    router.push({ pathname: '/schools/[id]/classes/new', params: { id: school.id } });

  const editClass = (schoolClass: SchoolClass) =>
    router.push({
      pathname: '/schools/[id]/classes/[classId]/edit',
      params: { id: school.id, classId: schoolClass.id },
    });

  const renderEmpty = () => {
    if (classes.isInitialLoading) return <ListSkeleton count={3} />;
    if (classes.error) {
      return (
        <EmptyState
          icon={WifiOff}
          title="Não foi possível carregar as turmas"
          description={classes.error}
          action={{ label: 'Tentar novamente', onPress: classes.refresh }}
        />
      );
    }
    if (classes.isFiltering) {
      return (
        <EmptyState
          icon={SearchX}
          title="Nenhuma turma encontrada"
          description="Tente outro termo ou turno."
          action={{ label: 'Limpar filtros', onPress: classes.clearFilters }}
        />
      );
    }
    return (
      <EmptyState
        icon={BookOpen}
        title="Nenhuma turma cadastrada"
        description="Cadastre a primeira turma desta escola."
        action={{ label: 'Cadastrar turma', onPress: newClass }}
      />
    );
  };

  return (
    <>
      <Stack.Screen options={{ title: school.name }} />
      <FlatList
        key={columns}
        data={classes.classes}
        numColumns={columns}
        keyExtractor={(item) => item.id}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerClassName="gap-3 pb-32 pt-4"
        contentContainerStyle={{ paddingHorizontal: horizontalPadding }}
        columnWrapperClassName={columns > 1 ? 'gap-3' : undefined}
        refreshControl={
          <RefreshControl refreshing={classes.isRefreshing} onRefresh={classes.refresh} />
        }
        ListHeaderComponent={
          <VStack className="gap-4 pb-2">
            <SchoolHeader
              school={school}
              onEdit={() =>
                router.push({ pathname: '/schools/[id]/edit', params: { id: school.id } })
              }
              onDelete={() => schoolDeletion.request(school)}
            />
            <Heading size="md" className="pt-2 text-foreground">
              Turmas
            </Heading>
            {classes.totalClasses > 0 ? (
              <VStack className="gap-3">
                <SearchBar
                  value={classes.query}
                  onChangeText={classes.setQuery}
                  placeholder="Buscar turma"
                />
                <ShiftFilter value={classes.shift} onChange={classes.setShift} />
              </VStack>
            ) : null}
          </VStack>
        }
        ListEmptyComponent={renderEmpty}
        renderItem={({ item }) => (
          <GridItem width={itemWidth}>
            <ClassCard schoolClass={item} onEdit={editClass} onDelete={classDeletion.request} />
          </GridItem>
        )}
      />
      <AddFab label="Nova turma" onPress={newClass} />
      <DeleteSchoolDialog
        school={schoolDeletion.target}
        isDeleting={schoolDeletion.isDeleting}
        onConfirm={schoolDeletion.confirm}
        onClose={schoolDeletion.cancel}
      />
      <DeleteClassDialog
        schoolClass={classDeletion.target}
        isDeleting={classDeletion.isDeleting}
        onConfirm={classDeletion.confirm}
        onClose={classDeletion.cancel}
      />
    </>
  );
}
