import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { applyServerErrors } from '@/shared/forms/apply-server-errors';
import { useAppToast } from '@/shared/hooks/use-app-toast';

import { schoolSchema, type SchoolFormValues } from '../schema';
import { useSchoolStore } from '../store/school-store';
import type { School } from '../types';

const FORM_FIELDS = ['name', 'address'] as const satisfies readonly (keyof SchoolFormValues)[];

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
      applyServerErrors(error, form.setError, FORM_FIELDS);
    }
  });

  return {
    control: form.control,
    submit,
    isSubmitting: form.formState.isSubmitting,
    formError: form.formState.errors.root?.message,
  };
}
