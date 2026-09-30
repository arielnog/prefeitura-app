import { SearchX, WifiOff } from 'lucide-react-native';

import { VStack } from '@/components/ui/vstack';
import { EmptyState } from '@/shared/components/empty-state';
import { ListSkeleton } from '@/shared/components/list-skeleton';

interface ResourceFallbackProps {
  resource: string;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

export function ResourceFallback({ resource, isLoading, error, onRetry }: ResourceFallbackProps) {
  if (isLoading) {
    return (
      <VStack className="p-4">
        <ListSkeleton count={2} />
      </VStack>
    );
  }
  if (error) {
    return (
      <EmptyState
        icon={WifiOff}
        title={`Não foi possível carregar a ${resource.toLowerCase()}`}
        description={error}
        action={{ label: 'Tentar novamente', onPress: onRetry }}
      />
    );
  }
  return (
    <EmptyState
      icon={SearchX}
      title={`${resource} não encontrada`}
      description="Ela pode ter sido excluída."
    />
  );
}
