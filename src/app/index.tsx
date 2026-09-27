import { router } from 'expo-router';
import { SearchX, School as SchoolIcon, WifiOff } from 'lucide-react-native';
import { FlatList, RefreshControl } from 'react-native';

import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { DeleteSchoolDialog } from '@/features/schools/components/delete-school-dialog';
import { SchoolCard } from '@/features/schools/components/school-card';
import { SchoolsSummary } from '@/features/schools/components/schools-summary';
import { SCHOOL_FILTER_LABELS, type SchoolFilter } from '@/features/schools/filters';
import { useDeleteSchool } from '@/features/schools/hooks/use-delete-school';
import { useSchools } from '@/features/schools/hooks/use-schools';
import type { School } from '@/features/schools/types';
import { AddFab } from '@/shared/components/add-fab';
import { Chip } from '@/shared/components/chip';
import { EmptyState } from '@/shared/components/empty-state';
import { ListSkeleton } from '@/shared/components/list-skeleton';
import { SearchBar } from '@/shared/components/search-bar';
import { useResponsive } from '@/shared/hooks/use-responsive';

const FILTERS = Object.keys(SCHOOL_FILTER_LABELS) as SchoolFilter[];

const openSchool = (school: School) =>
  router.push({ pathname: '/schools/[id]', params: { id: school.id } });

const editSchool = (school: School) =>
  router.push({ pathname: '/schools/[id]/edit', params: { id: school.id } });

export default function SchoolsScreen() {
  const {
    schools,
    totalSchools,
    totalClasses,
    query,
    setQuery,
    filter,
    setFilter,
    isFiltering,
    isInitialLoading,
    isRefreshing,
    error,
    refresh,
  } = useSchools();
  const deletion = useDeleteSchool();
  const { columns, isTablet } = useResponsive();

  const renderEmpty = () => {
    if (isInitialLoading) return <ListSkeleton />;
    if (error) {
      return (
        <EmptyState
          icon={WifiOff}
          title="Não foi possível carregar"
          description={error}
          action={{ label: 'Tentar novamente', onPress: refresh }}
        />
      );
    }
    if (isFiltering) {
      return (
        <EmptyState
          icon={SearchX}
          title="Nenhuma escola encontrada"
          description="Tente outro termo ou limpe os filtros."
          action={{
            label: 'Limpar filtros',
            onPress: () => {
              setQuery('');
              setFilter('all');
            },
          }}
        />
      );
    }
    return (
      <EmptyState
        icon={SchoolIcon}
        title="Nenhuma escola cadastrada"
        description="Cadastre a primeira escola para começar a organizar as turmas."
        action={{ label: 'Cadastrar escola', onPress: () => router.push('/schools/new') }}
      />
    );
  };

  return (
    <>
      <FlatList
        key={columns}
        data={schools}
        numColumns={columns}
        keyExtractor={(school) => school.id}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerClassName={`gap-3 px-4 pb-32 pt-2 ${isTablet ? 'px-8' : ''}`}
        columnWrapperClassName={columns > 1 ? 'gap-3' : undefined}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refresh} />}
        ListHeaderComponent={
          <VStack className="gap-4 pb-2">
            <SchoolsSummary totalSchools={totalSchools} totalClasses={totalClasses} />
            <SearchBar
              value={query}
              onChangeText={setQuery}
              placeholder="Buscar por nome ou endereço"
            />
            <HStack className="flex-wrap gap-2">
              {FILTERS.map((option) => (
                <Chip
                  key={option}
                  label={SCHOOL_FILTER_LABELS[option]}
                  selected={filter === option}
                  onPress={() => setFilter(option)}
                />
              ))}
            </HStack>
          </VStack>
        }
        ListEmptyComponent={renderEmpty}
        renderItem={({ item }) => (
          <SchoolCard
            school={item}
            onPress={openSchool}
            onEdit={editSchool}
            onDelete={deletion.request}
          />
        )}
      />
      <AddFab label="Nova escola" onPress={() => router.push('/schools/new')} />
      <DeleteSchoolDialog
        school={deletion.target}
        isDeleting={deletion.isDeleting}
        onConfirm={deletion.confirm}
        onClose={deletion.cancel}
      />
    </>
  );
}
