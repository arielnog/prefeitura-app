import { Plus } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Fab, FabIcon, FabLabel } from '@/components/ui/fab';

interface AddFabProps {
  label: string;
  onPress: () => void;
}

export function AddFab({ label, onPress }: AddFabProps) {
  const { bottom } = useSafeAreaInsets();

  return (
    <Fab
      size="lg"
      placement="bottom right"
      onPress={onPress}
      accessibilityLabel={label}
      className="bg-primary shadow-lg"
      style={{ marginBottom: bottom }}
    >
      <FabIcon as={Plus} className="text-primary-foreground" />
      <FabLabel className="font-semibold text-primary-foreground">{label}</FabLabel>
    </Fab>
  );
}
