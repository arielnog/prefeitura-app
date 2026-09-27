import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';

import { ApiError, getErrorMessage } from '@/shared/api/api-error';

/**
 * Leva o erro de uma submissão para o formulário: erros de campos conhecidos vão para o campo;
 * o restante (campos que a tela não exibe, falhas de rede etc.) vira o erro geral (`root`).
 */
export function applyServerErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  fields: readonly Path<T>[],
): void {
  if (!(error instanceof ApiError && error.isValidation)) {
    setError('root', { message: getErrorMessage(error) });
    return;
  }

  const unmatched: string[] = [];
  Object.entries(error.fieldErrors).forEach(([field, message]) => {
    if ((fields as readonly string[]).includes(field)) {
      setError(field as Path<T>, { message });
    } else {
      unmatched.push(message);
    }
  });

  if (unmatched.length > 0 || Object.keys(error.fieldErrors).length === 0) {
    setError('root', { message: unmatched.length ? unmatched.join('\n') : error.message });
  }
}
