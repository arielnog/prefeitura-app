import { CircleAlert } from 'lucide-react-native';

import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';

/** Erro geral do formulário (ex.: falha de rede), exibido dentro do modal onde o usuário está. */
export function FormErrorBanner({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <HStack
      className="items-center gap-3 rounded-xl bg-red-600 p-4"
      accessible
      accessibilityRole="alert"
      accessibilityLiveRegion="assertive"
    >
      <Icon as={CircleAlert} size="lg" className="text-white" />
      <Text size="sm" className="flex-1 text-white">
        {message}
      </Text>
    </HStack>
  );
}
