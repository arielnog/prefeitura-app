import { createSchoolStore } from '@/features/schools/store/school-store';
import { buildSchool, buildSchoolClass } from '@/test/factories';

import type { ClassRepository } from '../api/class-repository';
import { createClassStore, pruneClassesOfRemovedSchools } from '../store/class-store';

const makeRepository = (overrides: Partial<ClassRepository> = {}): jest.Mocked<ClassRepository> =>
  ({
    listBySchool: jest.fn().mockResolvedValue([]),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn().mockResolvedValue(undefined),
    ...overrides,
  }) as jest.Mocked<ClassRepository>;

const setup = (repository: ClassRepository) => {
  const onClassIdsChange = jest.fn();
  const store = createClassStore(repository, { onClassIdsChange, skipHydration: true });
  return { store, onClassIdsChange };
};

describe('class store', () => {
  it('fetches classes per school, sorted naturally, and syncs the school class ids', async () => {
    const b = buildSchoolClass({ schoolId: 's1', name: '10º Ano' });
    const a = buildSchoolClass({ schoolId: 's1', name: '2º Ano' });
    const { store, onClassIdsChange } = setup(
      makeRepository({ listBySchool: jest.fn().mockResolvedValue([b, a]) }),
    );

    await store.getState().fetchClasses('s1');

    expect(store.getState().classesBySchool.s1).toEqual([a, b]);
    expect(store.getState().statusBySchool.s1).toBe('success');
    expect(onClassIdsChange).toHaveBeenCalledWith('s1', [a.id, b.id]);
  });

  it('stores the error per school', async () => {
    const { store } = setup(
      makeRepository({ listBySchool: jest.fn().mockRejectedValue(new Error('offline')) }),
    );

    await store.getState().fetchClasses('s1');

    expect(store.getState().statusBySchool.s1).toBe('error');
    expect(store.getState().errorBySchool.s1).toBe('offline');
  });

  it('creates, updates and deletes a class keeping the school in sync', async () => {
    const created = buildSchoolClass({ schoolId: 's1', name: '1A' });
    const repository = makeRepository({
      create: jest.fn().mockResolvedValue(created),
      update: jest.fn().mockResolvedValue({ ...created, name: '1B' }),
    });
    const { store, onClassIdsChange } = setup(repository);

    await store
      .getState()
      .createClass({ schoolId: 's1', name: '1A', shift: 'morning', schoolYear: 2026 });
    expect(onClassIdsChange).toHaveBeenLastCalledWith('s1', [created.id]);

    await store.getState().updateClass(created, { name: '1B', shift: 'morning', schoolYear: 2026 });
    expect(store.getState().classesBySchool.s1[0].name).toBe('1B');

    await store.getState().deleteClass(created);
    expect(repository.remove).toHaveBeenCalledWith(created.id);
    expect(store.getState().classesBySchool.s1).toEqual([]);
    expect(onClassIdsChange).toHaveBeenLastCalledWith('s1', []);
  });

  it('drops cached classes of schools removed from the schools store', () => {
    const kept = buildSchool();
    const removed = buildSchool();
    const { store } = setup(makeRepository());
    const schoolStore = createSchoolStore({} as never, { skipHydration: true });
    schoolStore.setState({ schools: [kept, removed] });
    store.setState({
      classesBySchool: {
        [kept.id]: [buildSchoolClass({ schoolId: kept.id })],
        [removed.id]: [buildSchoolClass({ schoolId: removed.id })],
      },
    });
    const unsubscribe = pruneClassesOfRemovedSchools(store, schoolStore);

    schoolStore.setState({ schools: [kept] });

    expect(Object.keys(store.getState().classesBySchool)).toEqual([kept.id]);
    unsubscribe();
  });
});
