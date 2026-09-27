import type { ComponentProps } from 'react';

import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from '@/components/ui/form-control';
import { Input, InputField } from '@/components/ui/input';

type TextFieldProps = ComponentProps<typeof InputField> & {
  label: string;
  error?: string;
  isRequired?: boolean;
};

export function TextField({ label, error, isRequired, ...inputProps }: TextFieldProps) {
  return (
    <FormControl isInvalid={Boolean(error)} isRequired={isRequired}>
      <FormControlLabel>
        <FormControlLabelText className="font-medium text-foreground">{label}</FormControlLabelText>
      </FormControlLabel>
      <Input className="h-12 rounded-xl bg-card">
        <InputField aria-label={label} {...inputProps} />
      </Input>
      <FormControlError>
        <FormControlErrorText className="text-destructive">{error}</FormControlErrorText>
      </FormControlError>
    </FormControl>
  );
}
