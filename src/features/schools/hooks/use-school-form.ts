import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { ApiError, getErrorMessage } from '@/shared/api/api-error';
import { useAppToast } from '@/shared/hooks/use-app-toast';

import { schoolSchema, type SchoolFormValues } from '../schema';
import { useSchoolStore } from '../store/school-store';
import type { School } from '../types';

interface UseSchoolFormOptions {
  school?: School;
  onSaved: (school: School) => void;
}

export function useSchoolForm({ school, onSaved }: UseSchoolFormOptions) {
  const createSchool = useSchoolStore((state) => state.createSchool);
  const updateSchool = useSchoolStore((state) => state.updateSchool);
  const toast = useAppToast();

  const form = useForm<SchoolFormValues>({
    resolver: zodResolver(schoolSchema),
    defaultValues: { name: school?.name ?? '', address: school?.address ?? '' },
    mode: 'onTouched',
  });

  const submit = form.handleSubmit(async (values) => {
    try {
      const saved = school ? await updateSchool(school.id, values) : await createSchool(values);
      toast.success(school ? 'Escola atualizada' : 'Escola cadastrada');
      onSaved(saved);
    } catch (error) {
      if (error instanceof ApiError && error.isValidation) {
        Object.entries(error.fieldErrors).forEach(([field, message]) =>
          form.setError(field as keyof SchoolFormValues, { message }),
        );
        return;
      }
      toast.error(getErrorMessage(error));
    }
  });

  return { control: form.control, submit, isSubmitting: form.formState.isSubmitting };
}
