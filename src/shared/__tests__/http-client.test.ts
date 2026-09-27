import { ApiError } from '../api/api-error';
import { FetchHttpClient } from '../api/http-client';

const mockResponse = (status: number, body?: unknown) =>
  Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    text: () => Promise.resolve(body === undefined ? '' : JSON.stringify(body)),
  } as Response);

describe('FetchHttpClient', () => {
  const client = new FetchHttpClient('https://api.test');
  const fetchMock = jest.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    globalThis.fetch = fetchMock;
  });

  it('builds the url with query params, skipping undefined values', async () => {
    fetchMock.mockReturnValue(mockResponse(200, []));

    await client.get('/classes', { schoolId: '1', shift: undefined });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.test/classes?schoolId=1',
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('serializes the body and parses the json response', async () => {
    fetchMock.mockReturnValue(mockResponse(201, { id: '1' }));

    const result = await client.post('/schools', { name: 'A' });

    expect(result).toEqual({ id: '1' });
    expect(fetchMock.mock.calls[0][1].body).toBe(JSON.stringify({ name: 'A' }));
  });

  it('handles empty 204 responses', async () => {
    fetchMock.mockReturnValue(mockResponse(204));
    await expect(client.delete('/schools/1')).resolves.toBeUndefined();
  });

  it('translates error responses into ApiError with field errors', async () => {
    fetchMock.mockReturnValue(
      mockResponse(422, { message: 'Dados inválidos', errors: { name: 'Nome é obrigatório' } }),
    );

    const error = await client.post('/schools', {}).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({
      status: 422,
      message: 'Dados inválidos',
      fieldErrors: { name: 'Nome é obrigatório' },
    });
    expect((error as ApiError).isValidation).toBe(true);
  });

  it('wraps network failures', async () => {
    fetchMock.mockRejectedValue(new TypeError('Network request failed'));

    await expect(client.get('/schools')).rejects.toMatchObject({
      status: 0,
      message: 'Não foi possível conectar ao servidor.',
    });
  });

  it('returns a friendly ApiError when an error response is not json', async () => {
    fetchMock.mockReturnValue(
      Promise.resolve({
        ok: false,
        status: 502,
        text: () => Promise.resolve('<html>Bad Gateway</html>'),
      } as Response),
    );

    await expect(client.get('/schools')).rejects.toMatchObject({
      name: 'ApiError',
      status: 502,
      message: 'O servidor não conseguiu atender a solicitação (erro 502).',
    });
  });

  it('rejects successful responses with an invalid body', async () => {
    fetchMock.mockReturnValue(
      Promise.resolve({ ok: true, status: 200, text: () => Promise.resolve('oops') } as Response),
    );

    await expect(client.get('/schools')).rejects.toMatchObject({
      message: 'O servidor retornou uma resposta inválida.',
    });
  });
});
