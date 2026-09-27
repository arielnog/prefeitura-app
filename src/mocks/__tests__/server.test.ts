import type { SchoolClass } from '@/features/classes/types';
import type { School } from '@/features/schools/types';

import type { DbSnapshot } from '../persistence';
import { SCHOOL_SEEDS } from '../seeds';
import { makeServer } from '../server';

const API = 'https://api.test';

const request = async <T>(path: string, init?: RequestInit) => {
  const response = await fetch(`${API}/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  const body = response.status === 204 ? null : ((await response.json()) as T);
  return { status: response.status, body: body as T };
};

describe('mock server', () => {
  let server: ReturnType<typeof makeServer>;

  beforeEach(() => {
    server = makeServer({ urlPrefix: API, environment: 'test' });
  });

  afterEach(() => server.shutdown());

  it('lists schools with their class ids', async () => {
    server.db.emptyData();
    const { body: school } = await request<School>('/schools', {
      method: 'POST',
      body: JSON.stringify({ name: 'A', address: 'Rua 1' }),
    });
    const { body: schoolClass } = await request<SchoolClass>('/classes', {
      method: 'POST',
      body: JSON.stringify({ schoolId: school.id, name: '1A', shift: 'morning', schoolYear: 2026 }),
    });

    const { status, body } = await request<School[]>('/schools');

    expect(status).toBe(200);
    expect(body).toHaveLength(1);
    expect(body[0]).toMatchObject({ name: 'A', address: 'Rua 1', classIds: [schoolClass.id] });
  });

  it('creates a school and rejects missing required fields', async () => {
    const created = await request<School>('/schools', {
      method: 'POST',
      body: JSON.stringify({ name: ' Nova Escola ', address: 'Rua X' }),
    });
    expect(created.status).toBe(201);
    expect(created.body).toMatchObject({ name: 'Nova Escola', classIds: [] });

    const invalid = await request<{ errors: Record<string, string> }>('/schools', {
      method: 'POST',
      body: JSON.stringify({ name: '', address: '' }),
    });
    expect(invalid.status).toBe(422);
    expect(Object.keys(invalid.body.errors)).toEqual(['name', 'address']);
  });

  it('creates, filters, updates and deletes classes of a school', async () => {
    const { body: school } = await request<School>('/schools', {
      method: 'POST',
      body: JSON.stringify({ name: 'E', address: 'R' }),
    });

    const { status, body: created } = await request<SchoolClass>('/classes', {
      method: 'POST',
      body: JSON.stringify({
        schoolId: school.id,
        name: '2B',
        shift: 'afternoon',
        schoolYear: 2026,
      }),
    });
    expect(status).toBe(201);

    const { body: list } = await request<SchoolClass[]>(`/classes?schoolId=${school.id}`);
    expect(list.map((c) => c.id)).toEqual([created.id]);

    const { body: updated } = await request<SchoolClass>(`/classes/${created.id}`, {
      method: 'PUT',
      body: JSON.stringify({ name: '2C', shift: 'evening', schoolYear: 2027 }),
    });
    expect(updated).toMatchObject({ name: '2C', shift: 'evening', schoolYear: 2027 });

    const removed = await request(`/classes/${created.id}`, { method: 'DELETE' });
    expect(removed.status).toBe(204);
  });

  it('rejects classes with invalid shift or school', async () => {
    const invalid = await request<{ errors: Record<string, string> }>('/classes', {
      method: 'POST',
      body: JSON.stringify({ schoolId: '1', name: 'X', shift: 'night', schoolYear: 2026 }),
    });
    expect(invalid.status).toBe(422);
    expect(invalid.body.errors).toHaveProperty('shift');

    const orphan = await request('/classes', {
      method: 'POST',
      body: JSON.stringify({ schoolId: '999', name: 'X', shift: 'morning', schoolYear: 2026 }),
    });
    expect(orphan.status).toBe(422);
  });

  it('deletes a school together with its classes', async () => {
    const [first] = (await request<School[]>('/schools')).body;
    expect(first.classIds.length).toBeGreaterThan(0);

    expect((await request(`/schools/${first.id}`, { method: 'DELETE' })).status).toBe(204);
    expect((await request(`/schools/${first.id}`)).status).toBe(404);

    const { body: orphans } = await request<SchoolClass[]>(`/classes?schoolId=${first.id}`);
    expect(orphans).toHaveLength(0);
  });

  it('restores state from a snapshot and notifies writes', async () => {
    const onChange = jest.fn();
    server.shutdown();
    const snapshot = server.db.dump() as unknown as DbSnapshot;
    server = makeServer({ urlPrefix: API, environment: 'test', snapshot, onChange });

    const { body } = await request<School[]>('/schools');
    expect(body).toHaveLength(SCHOOL_SEEDS.length);
    expect(onChange).not.toHaveBeenCalled();

    await request('/schools', {
      method: 'POST',
      body: JSON.stringify({ name: 'N', address: 'A' }),
    });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0].schools).toHaveLength(SCHOOL_SEEDS.length + 1);
  });
});
