import { belongsTo, createServer, Factory, hasMany, Model, Response, type Server } from 'miragejs';
import type { AnyRegistry } from 'miragejs/-types';
import type Schema from 'miragejs/orm/schema';

import { SHIFTS, type SchoolClass } from '@/features/classes/types';
import type { School } from '@/features/schools/types';

import type { DbSnapshot } from './persistence';
import { SCHOOL_SEEDS } from './seeds';

type SchoolAttrs = Omit<School, 'classIds'>;
type SchoolClassAttrs = SchoolClass;

interface SchoolRecord extends SchoolAttrs {
  schoolClassIds: string[];
  schoolClasses: { destroy(): void };
  update(attrs: Partial<SchoolAttrs>): void;
  destroy(): void;
}

interface SchoolClassRecord extends SchoolClassAttrs {
  update(attrs: Partial<SchoolClassAttrs>): void;
  destroy(): void;
}

type AppSchema = Schema<AnyRegistry>;
type ValidationErrors = Record<string, string>;

const now = () => new Date().toISOString();

const models = {
  school: Model.extend({ schoolClasses: hasMany() }),
  schoolClass: Model.extend({ school: belongsTo() }),
};

const factories = {
  school: Factory.extend({ createdAt: now, updatedAt: now }),
  schoolClass: Factory.extend({ createdAt: now, updatedAt: now }),
};

type ModelName = 'school' | 'schoolClass';

const createRecord = <T>(target: AppSchema | Server, model: ModelName, attrs: object) =>
  target.create(model, attrs as never) as unknown as T;

const findSchool = (schema: AppSchema, id: string) =>
  schema.find('school', id) as unknown as SchoolRecord | null;

const findSchoolClass = (schema: AppSchema, id: string) =>
  schema.find('schoolClass', id) as unknown as SchoolClassRecord | null;

const toSchool = (record: SchoolRecord): School => ({
  id: record.id,
  name: record.name,
  address: record.address,
  classIds: record.schoolClassIds,
  createdAt: record.createdAt,
  updatedAt: record.updatedAt,
});

const toSchoolClass = (record: SchoolClassRecord): SchoolClass => ({
  id: record.id,
  schoolId: record.schoolId,
  name: record.name,
  shift: record.shift,
  schoolYear: record.schoolYear,
  createdAt: record.createdAt,
  updatedAt: record.updatedAt,
});

const notFound = (entity: string) => new Response(404, {}, { message: `${entity} não encontrada` });

const unprocessable = (errors: ValidationErrors) =>
  new Response(422, {}, { message: 'Dados inválidos', errors });

const isBlank = (value: unknown) => typeof value !== 'string' || value.trim().length === 0;

const hasErrors = (errors: ValidationErrors) => Object.keys(errors).length > 0;

function validateSchool(body: Partial<SchoolAttrs>): ValidationErrors {
  const errors: ValidationErrors = {};
  if (isBlank(body.name)) errors.name = 'Nome é obrigatório';
  if (isBlank(body.address)) errors.address = 'Endereço é obrigatório';
  return errors;
}

function validateSchoolClass(body: Partial<SchoolClassAttrs>): ValidationErrors {
  const errors: ValidationErrors = {};
  if (isBlank(body.name)) errors.name = 'Nome é obrigatório';
  if (!SHIFTS.includes(body.shift as SchoolClass['shift'])) errors.shift = 'Turno inválido';
  const year = body.schoolYear;
  if (!Number.isInteger(year) || year! < 2000 || year! > 2100) {
    errors.schoolYear = 'Ano letivo inválido';
  }
  return errors;
}

const parseBody = <T>(requestBody: string) => JSON.parse(requestBody || '{}') as Partial<T>;

function seed(server: Server) {
  SCHOOL_SEEDS.forEach(({ classes, ...school }) => {
    const created = createRecord<SchoolRecord>(server, 'school', school);
    classes.forEach((schoolClass) =>
      createRecord(server, 'schoolClass', { ...schoolClass, school: created }),
    );
  });
}

export interface MockServerOptions {
  urlPrefix: string;
  environment?: 'development' | 'test';
  snapshot?: DbSnapshot | null;
  onChange?: (snapshot: DbSnapshot) => void;
}

export function makeServer({
  urlPrefix,
  environment = 'development',
  snapshot,
  onChange,
}: MockServerOptions): Server {
  const server = createServer({
    environment,
    urlPrefix,
    models,
    factories,
    timing: environment === 'test' ? 0 : 400,
    logging: false,

    routes() {
      this.namespace = 'api';

      this.get('/schools', (schema: AppSchema) =>
        (schema.all('school').models as unknown as SchoolRecord[]).map(toSchool),
      );

      this.get('/schools/:id', (schema: AppSchema, request) => {
        const school = findSchool(schema, request.params.id);
        return school ? toSchool(school) : notFound('Escola');
      });

      this.post('/schools', (schema: AppSchema, request) => {
        const body = parseBody<SchoolAttrs>(request.requestBody);
        const errors = validateSchool(body);
        if (hasErrors(errors)) return unprocessable(errors);

        const timestamp = now();
        const school = createRecord<SchoolRecord>(schema, 'school', {
          name: body.name!.trim(),
          address: body.address!.trim(),
          createdAt: timestamp,
          updatedAt: timestamp,
        });
        return new Response(201, {}, toSchool(school));
      });

      this.put('/schools/:id', (schema: AppSchema, request) => {
        const school = findSchool(schema, request.params.id);
        if (!school) return notFound('Escola');

        const body = parseBody<SchoolAttrs>(request.requestBody);
        const errors = validateSchool(body);
        if (hasErrors(errors)) return unprocessable(errors);

        school.update({ name: body.name!.trim(), address: body.address!.trim(), updatedAt: now() });
        return toSchool(school);
      });

      this.delete('/schools/:id', (schema: AppSchema, request) => {
        const school = findSchool(schema, request.params.id);
        if (!school) return notFound('Escola');

        school.schoolClasses.destroy();
        school.destroy();
        return new Response(204);
      });

      this.get('/classes', (schema: AppSchema, request) => {
        const { schoolId } = request.queryParams;
        const collection = schoolId
          ? schema.where('schoolClass', { schoolId: String(schoolId) } as never)
          : schema.all('schoolClass');
        return (collection.models as unknown as SchoolClassRecord[]).map(toSchoolClass);
      });

      this.get('/classes/:id', (schema: AppSchema, request) => {
        const schoolClass = findSchoolClass(schema, request.params.id);
        return schoolClass ? toSchoolClass(schoolClass) : notFound('Turma');
      });

      this.post('/classes', (schema: AppSchema, request) => {
        const body = parseBody<SchoolClassAttrs>(request.requestBody);
        const school = body.schoolId ? findSchool(schema, body.schoolId) : null;
        if (!school) return unprocessable({ schoolId: 'Escola inválida' });

        const errors = validateSchoolClass(body);
        if (hasErrors(errors)) return unprocessable(errors);

        const timestamp = now();
        const schoolClass = createRecord<SchoolClassRecord>(schema, 'schoolClass', {
          name: body.name!.trim(),
          shift: body.shift,
          schoolYear: body.schoolYear,
          school,
          createdAt: timestamp,
          updatedAt: timestamp,
        });
        return new Response(201, {}, toSchoolClass(schoolClass));
      });

      this.put('/classes/:id', (schema: AppSchema, request) => {
        const schoolClass = findSchoolClass(schema, request.params.id);
        if (!schoolClass) return notFound('Turma');

        const body = parseBody<SchoolClassAttrs>(request.requestBody);
        const errors = validateSchoolClass(body);
        if (hasErrors(errors)) return unprocessable(errors);

        schoolClass.update({
          name: body.name!.trim(),
          shift: body.shift,
          schoolYear: body.schoolYear,
          updatedAt: now(),
        });
        return toSchoolClass(schoolClass);
      });

      this.delete('/classes/:id', (schema: AppSchema, request) => {
        const schoolClass = findSchoolClass(schema, request.params.id);
        if (!schoolClass) return notFound('Turma');

        schoolClass.destroy();
        return new Response(204);
      });
    },
  });

  if (snapshot) {
    server.db.loadData(snapshot);
  } else {
    seed(server);
  }

  if (onChange) {
    server.pretender.handledRequest = (verb: string) => {
      if (verb !== 'GET') onChange(server.db.dump() as unknown as DbSnapshot);
    };
  }

  return server;
}
