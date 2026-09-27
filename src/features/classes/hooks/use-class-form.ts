import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { applyServerErrors } from '@/shared/forms/apply-server-errors';
import { useAppToast } from '@/shared/hooks/use-app-toast';

import { schoolClassSchema, type SchoolClassFormValues } from '../schema';
import { useClassStore } from '../store/class-store';
import type { SchoolClass } from '../types';

const FORM_FIELDS = [
  'name',
  'shift',
  'schoolYear',
] as const satisfies readonly (keyof SchoolClassFormValues)[];

interface UseClassFormOptions {
  schoolId: string;
  schoolClass?: SchoolClass;
  onSaved: (schoolClass: SchoolClass) => void;
}

export function useClassForm({ schoolId, schoolClass, onSaved }: UseClassFormOptions) {
  const createClass = useClassStore((state) => state.createClass);
  const updateClass = useClassStore((state) => state.updateClass);
  const toast = useAppToast();

  const form = useForm<SchoolClassFormValues>({
    resolver: zodResolver(schoolClassSchema),
    defaultValues: {
      name: schoolClass?.name ?? '',
      shift: schoolClass?.shift,
      schoolYear: schoolClass?.schoolYear ?? new Date().getFullYear(),
    },
    mode: 'onTouched',
  });

  const submit = form.handleSubmit(async (values) => {
    try {
      const saved = schoolClass
        ? await updateClass(schoolClass, values)
        : await createClass({ ...values, schoolId });
      toast.success(schoolClass ? 'Turma atualizada' : 'Turma cadastrada');
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
