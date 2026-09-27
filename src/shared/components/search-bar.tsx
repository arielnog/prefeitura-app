import { Search, X } from 'lucide-react-native';

import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';

interface SearchBarProps {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChangeText, placeholder = 'Buscar' }: SearchBarProps) {
  return (
    <Input className="h-11 rounded-xl bg-card">
      <InputSlot>
        <InputIcon as={Search} />
      </InputSlot>
      <InputField
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        returnKeyType="search"
        autoCorrect={false}
        accessibilityLabel={placeholder}
      />
      {value ? (
        <InputSlot
          onPress={() => onChangeText('')}
          accessibilityRole="button"
          accessibilityLabel="Limpar busca"
          hitSlop={8}
        >
          <InputIcon as={X} />
        </InputSlot>
      ) : null}
    </Input>
  );
}
