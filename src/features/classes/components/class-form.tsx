import type { ReactNode } from 'react';
import { Controller } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from '@/components/ui/form-control';
import { VStack } from '@/components/ui/vstack';
import { TextField } from '@/shared/components/text-field';

import { useClassForm } from '../hooks/use-class-form';
import type { SchoolClass } from '../types';
import { ShiftSelector } from './shift-selector';
import { YearStepper } from './year-stepper';

interface ClassFormProps {
  schoolId: string;
  schoolClass?: SchoolClass;
  onSaved: (schoolClass: SchoolClass) => void;
}

function FieldGroup({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <FormControl isInvalid={Boolean(error)} isRequired>
      <FormControlLabel>
        <FormControlLabelText className="font-medium text-foreground">{label}</FormControlLabelText>
      </FormControlLabel>
      {children}
      <FormControlError>
        <FormControlErrorText className="text-destructive">{error}</FormControlErrorText>
      </FormControlError>
    </FormControl>
  );
}

export function ClassForm({ schoolId, schoolClass, onSaved }: ClassFormProps) {
  const { control, submit, isSubmitting } = useClassForm({ schoolId, schoolClass, onSaved });

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
              label="Nome da turma"
              isRequired
              placeholder="Ex.: 1º Ano A"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
              returnKeyType="done"
              autoFocus={!schoolClass}
            />
          )}
        />
        <Controller
          control={control}
          name="shift"
          render={({ field, fieldState }) => (
            <FieldGroup label="Turno" error={fieldState.error?.message}>
              <ShiftSelector value={field.value} onChange={field.onChange} />
            </FieldGroup>
          )}
        />
        <Controller
          control={control}
          name="schoolYear"
          render={({ field, fieldState }) => (
            <FieldGroup label="Ano letivo" error={fieldState.error?.message}>
              <YearStepper value={field.value} onChange={field.onChange} />
            </FieldGroup>
          )}
        />
        <VStack className="pt-2">
          <Button size="lg" className="h-12 rounded-xl" onPress={submit} isDisabled={isSubmitting}>
            {isSubmitting ? <ButtonSpinner /> : null}
            <ButtonText>{schoolClass ? 'Salvar alterações' : 'Cadastrar turma'}</ButtonText>
          </Button>
        </VStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
