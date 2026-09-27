import { HttpSchoolRepository } from '@/features/schools/api/school-repository';
import { startMockApi } from '@/test/mock-api';

import { HttpClassRepository } from '../api/class-repository';

describe('HttpClassRepository (against the mock API)', () => {
  let api: ReturnType<typeof startMockApi>;
  let classes: HttpClassRepository;
  let schools: HttpSchoolRepository;

  beforeEach(() => {
    api = startMockApi();
    classes = new HttpClassRepository(api.http);
    schools = new HttpSchoolRepository(api.http);
  });

  afterEach(() => api.server.shutdown());

  it('lists only the classes of the given school', async () => {
    const [school] = await schools.list();

    const result = await classes.listBySchool(school.id);

    expect(result.map((item) => item.id).sort()).toEqual([...school.classIds].sort());
    expect(result.every((item) => item.schoolId === school.id)).toBe(true);
  });

  it('creates, updates and removes a class, keeping the school class ids in sync', async () => {
    const school = await schools.create({ name: 'Escola', address: 'Rua' });

    const created = await classes.create({
      schoolId: school.id,
      name: '1º Ano A',
      shift: 'morning',
      schoolYear: 2026,
    });
    expect((await schools.get(school.id)).classIds).toEqual([created.id]);

    const updated = await classes.update(created.id, {
      name: '1º Ano B',
      shift: 'full',
      schoolYear: 2027,
    });
    expect(updated).toMatchObject({
      id: created.id,
      name: '1º Ano B',
      shift: 'full',
      schoolYear: 2027,
    });

    await classes.remove(created.id);
    expect(await classes.listBySchool(school.id)).toEqual([]);
    expect((await schools.get(school.id)).classIds).toEqual([]);
  });

  it('rejects a class for a school that does not exist', async () => {
    await expect(
      classes.create({ schoolId: '999', name: 'X', shift: 'morning', schoolYear: 2026 }),
    ).rejects.toMatchObject({ status: 422, fieldErrors: { schoolId: 'Escola inválida' } });
  });
});
