export type FieldErrors = Record<string, string>;

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly fieldErrors: FieldErrors = {},
  ) {
    super(message);
    this.name = 'ApiError';
  }

  get isNotFound() {
    return this.status === 404;
  }

  get isValidation() {
    return this.status === 422;
  }
}

export const getErrorMessage = (error: unknown, fallback = 'Algo deu errado. Tente novamente.') =>
  error instanceof Error && error.message ? error.message : fallback;
