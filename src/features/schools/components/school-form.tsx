import { Controller } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { VStack } from '@/components/ui/vstack';
import { TextField } from '@/shared/components/text-field';

import { useSchoolForm } from '../hooks/use-school-form';
import type { School } from '../types';

interface SchoolFormProps {
  school?: School;
  onSaved: (school: School) => void;
}

export function SchoolForm({ school, onSaved }: SchoolFormProps) {
  const { control, submit, isSubmitting } = useSchoolForm({ school, onSaved });

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerClassName="gap-5 p-5" keyboardShouldPersistTaps="handled">
        <Controller
          control={control}
          name="name"
          render={({ field, fieldState }) => (
            <TextField
              label="Nome da escola"
              isRequired
              placeholder="Ex.: EMEF Monteiro Lobato"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
              autoCapitalize="words"
              returnKeyType="next"
              autoFocus={!school}
            />
          )}
        />
        <Controller
          control={control}
          name="address"
          render={({ field, fieldState }) => (
            <TextField
              label="Endereço"
              isRequired
              placeholder="Rua, número - bairro"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
              returnKeyType="done"
              onSubmitEditing={submit}
            />
          )}
        />
        <VStack className="pt-2">
          <Button size="lg" className="h-12 rounded-xl" onPress={submit} isDisabled={isSubmitting}>
            {isSubmitting ? <ButtonSpinner /> : null}
            <ButtonText>{school ? 'Salvar alterações' : 'Cadastrar escola'}</ButtonText>
          </Button>
        </VStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
