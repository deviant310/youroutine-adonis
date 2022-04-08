declare module '@ioc:Adonis/Core/Repository' {
  import { DateTime } from 'luxon';
  import { CamelCase, SnakeCase } from 'type-fest';

  export interface Repository<Model> {
    getById (id: string | number): Promise<Model | null>;

    getByIdOrFail (id: string | number): Promise<Model>;

    getFirstOfList<Clause extends SamplingClause<Model>> (clause: Clause): Promise<ModelPlucked<Model, Clause> | null>;

    getFirstOfListOrFail<Clause extends SamplingClause<Model>> (clause: Clause): Promise<ModelPlucked<Model, Clause>>;

    getList<Clause extends SamplingClause<Model>> (clause: Clause): Promise<ModelPlucked<Model, Clause>[] | never[]>;

    add (attributes: LocalAddAttributes<Model>): Promise<Model>;

    updateById (id: string | number, attributes: LocalUpdateAttributes<Model>): Promise<Model>;

    deleteById (id: string | number): Promise<void>;
  }

  type LocalProperties<Model> = Pick<Model, {
    [K in keyof Model]: Model[K] extends Function ? never : Model[K] extends LocalValues ? K : never;
  }[keyof Model]>;

  type DatabaseProperties<Model> = Pick<Model, {
    [K in keyof Model]: Model[K] extends Function ? never : K;
  }[keyof Model]>;

  export interface SamplingClause<Model> {
    readonly where: Readonly<Partial<LocalProperties<Model>>>;
    readonly select: readonly (keyof LocalProperties<Model>)[];
  }

  export type ModelPlucked<Model, Clause extends SamplingClause<Model>> = Omit<Model, keyof Omit<LocalProperties<Model>, Clause['select'][number]>>;

  export type DatabaseAttributes<Model, T = DatabaseProperties<Model>> = {
    [K in keyof T as SnakeCase<K>]: DatabaseValues
  };

  export type LocalAttributes<Model, T = LocalProperties<Model>> = {
    [K in keyof T as CamelCase<K>]: T[K]
  };

  export type LocalAddAttributes<Model> = OmitReadable<LocalAttributes<Model>>;

  export type LocalUpdateAttributes<Model> = Partial<OmitReadable<LocalAttributes<Model>>>;

  export type LocalValues =
    string
    | number
    | boolean
    | DateTime
    | string[]
    | number[]
    | DateTime[]
    | boolean[]
    | Buffer
    | null
    | undefined;

  export type DatabaseValues =
    string
    | number
    | boolean
    | Date
    | string[]
    | number[]
    | Date[]
    | boolean[]
    | Buffer
    | null
    | undefined;
}
