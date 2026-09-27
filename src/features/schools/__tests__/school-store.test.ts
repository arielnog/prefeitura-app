import { buildSchool } from '@/test/factories';

import type { SchoolRepository } from '../api/school-repository';
import { createSchoolStore } from '../store/school-store';

const makeRepository = (overrides: Partial<SchoolRepository> = {}): jest.Mocked<SchoolRepository> =>
  ({
    list: jest.fn().mockResolvedValue([]),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn().mockResolvedValue(undefined),
    ...overrides,
  }) as jest.Mocked<SchoolRepository>;

describe('school store', () => {
  it('fetches schools sorted by name', async () => {
    const repository = makeRepository({
      list: jest
        .fn()
        .mockResolvedValue([buildSchool({ name: 'Zeta' }), buildSchool({ name: 'Álamo' })]),
    });
    const store = createSchoolStore(repository, { skipHydration: true });

    await store.getState().fetchSchools();

    expect(store.getState().status).toBe('success');
    expect(store.getState().schools.map((s) => s.name)).toEqual(['Álamo', 'Zeta']);
  });

  it('keeps cached schools and exposes the error when fetching fails', async () => {
    const cached = buildSchool();
    const store = createSchoolStore(
      makeRepository({ list: jest.fn().mockRejectedValue(new Error('offline')) }),
      { skipHydration: true },
    );
    store.setState({ schools: [cached] });

    await store.getState().fetchSchools();

    expect(store.getState()).toMatchObject({
      status: 'error',
      error: 'offline',
      schools: [cached],
    });
  });

  it('creates, updates and deletes schools', async () => {
    const school = buildSchool({ name: 'Nova' });
    const repository = makeRepository({
      create: jest.fn().mockResolvedValue(school),
      update: jest.fn().mockResolvedValue({ ...school, name: 'Renomeada' }),
    });
    const store = createSchoolStore(repository, { skipHydration: true });

    await store.getState().createSchool({ name: 'Nova', address: 'Rua' });
    expect(store.getState().schools).toEqual([school]);

    await store.getState().updateSchool(school.id, { name: 'Renomeada', address: 'Rua' });
    expect(store.getState().schools[0].name).toBe('Renomeada');

    await store.getState().deleteSchool(school.id);
    expect(repository.remove).toHaveBeenCalledWith(school.id);
    expect(store.getState().schools).toEqual([]);
  });

  it('does not change state when a mutation fails', async () => {
    const store = createSchoolStore(
      makeRepository({ create: jest.fn().mockRejectedValue(new Error('422')) }),
      { skipHydration: true },
    );

    await expect(store.getState().createSchool({ name: '', address: '' })).rejects.toThrow('422');
    expect(store.getState().schools).toEqual([]);
  });

  it('syncs class ids of a school', () => {
    const school = buildSchool();
    const store = createSchoolStore(makeRepository(), { skipHydration: true });
    store.setState({ schools: [school] });

    store.getState().setClassIds(school.id, ['10', '11']);

    expect(store.getState().schools[0].classIds).toEqual(['10', '11']);
  });

  it('fetches a single school and upserts it', async () => {
    const existing = buildSchool({ name: 'B' });
    const fetched = buildSchool({ name: 'A' });
    const store = createSchoolStore(makeRepository({ get: jest.fn().mockResolvedValue(fetched) }), {
      skipHydration: true,
    });
    store.setState({ schools: [existing] });

    await store.getState().fetchSchool(fetched.id);
    await store.getState().fetchSchool(fetched.id);

    expect(store.getState().schools).toEqual([fetched, existing]);
  });
});
