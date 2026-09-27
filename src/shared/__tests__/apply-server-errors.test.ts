import { ApiError } from '../api/api-error';
import { applyServerErrors } from '../forms/apply-server-errors';

type Values = { name: string; address: string };
const FIELDS = ['name', 'address'] as const;

describe('applyServerErrors', () => {
  it('maps known fields to their inputs', () => {
    const setError = jest.fn();

    applyServerErrors<Values>(
      new ApiError('Dados inválidos', 422, { name: 'Nome é obrigatório' }),
      setError,
      FIELDS,
    );

    expect(setError).toHaveBeenCalledTimes(1);
    expect(setError).toHaveBeenCalledWith('name', { message: 'Nome é obrigatório' });
  });

  it('sends errors of fields the form does not show to the root error', () => {
    const setError = jest.fn();

    applyServerErrors<Values>(
      new ApiError('Dados inválidos', 422, { name: 'Nome curto', schoolId: 'Escola inválida' }),
      setError,
      FIELDS,
    );

    expect(setError).toHaveBeenCalledWith('name', { message: 'Nome curto' });
    expect(setError).toHaveBeenCalledWith('root', { message: 'Escola inválida' });
  });

  it('uses the api message for validation errors without field details', () => {
    const setError = jest.fn();

    applyServerErrors<Values>(new ApiError('Dados inválidos', 422), setError, FIELDS);

    expect(setError).toHaveBeenCalledWith('root', { message: 'Dados inválidos' });
  });

  it('sends any other failure to the root error', () => {
    const setError = jest.fn();

    applyServerErrors<Values>(new ApiError('Sem conexão', 0), setError, FIELDS);

    expect(setError).toHaveBeenCalledWith('root', { message: 'Sem conexão' });
  });
});
