import { ApiError } from '@/shared/api/api-error';
import { startMockApi } from '@/test/mock-api';

import { HttpSchoolRepository } from '../api/school-repository';

describe('HttpSchoolRepository (against the mock API)', () => {
  let api: ReturnType<typeof startMockApi>;
  let repository: HttpSchoolRepository;

  beforeEach(() => {
    api = startMockApi();
    repository = new HttpSchoolRepository(api.http);
  });

  afterEach(() => api.server.shutdown());

  it('lists the seeded schools with their class ids', async () => {
    const schools = await repository.list();

    expect(schools.length).toBeGreaterThan(0);
    expect(schools[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
        classIds: expect.any(Array),
      }),
    );
  });

  it('creates, reads, updates and removes a school', async () => {
    const created = await repository.create({ name: 'Escola Nova', address: 'Rua 1' });
    expect(await repository.get(created.id)).toEqual(created);

    const updated = await repository.update(created.id, {
      name: 'Escola Renomeada',
      address: 'Rua 2',
    });
    expect(updated).toMatchObject({ id: created.id, name: 'Escola Renomeada', address: 'Rua 2' });

    await repository.remove(created.id);
    await expect(repository.get(created.id)).rejects.toMatchObject({ status: 404 });
  });

  it('surfaces validation errors as ApiError with field errors', async () => {
    const error = await repository.create({ name: ' ', address: '' }).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).fieldErrors).toEqual({
      name: 'Nome é obrigatório',
      address: 'Endereço é obrigatório',
    });
  });
});
