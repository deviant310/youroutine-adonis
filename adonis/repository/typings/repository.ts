declare module '@ioc:Adonis/Core/Repository' {
  import { DateTime } from 'luxon';
  import { CamelCase, SnakeCase } from 'type-fest';

  export interface Repository<Model> {
    getById (id: string | number): Promise<Model | null>;

    getByIdOrFail (id: string | number): Promise<Model>;

    getFirstOfList<Clause extends SamplingClause<Model>> (clause: Clause): Promise<ModelPlucked<Model, Clause> | null>;

    getFirstOfListOrFail<Clause extends SamplingClause<Model>> (clause: Clause): Promise<ModelPlucked<Model, Clause>>;

    getList<Clause extends SamplingClause<Model>> (clause: Clause): Promise<ModelPlucked<Model, Clause>[] | never[]>;

    add (attributes: InlineAddAttributes<Model>): Promise<Model>;

    updateById (id: string | number, attributes: InlineUpdateAttributes<Model>): Promise<Model>;

    deleteById (id: string | number): Promise<void>;
  }

  export type ModelPlucked<Model, Clause extends SamplingClause<Model>> = Pick<Model, Clause['select'][number] extends keyof Model ? Clause['select'][number] : never>;

  export type ModelProperties<Model> = Pick<Model, {
    [K in keyof Model]: Model[K] extends Function ? never : Model[K] extends DataValues ? K : never;
  }[keyof Model]>;

  export interface SamplingClause<Model> {
    readonly where: Readonly<Partial<ModelProperties<Model>>>;
    readonly select: readonly string[];
  }

  export type DatabaseAttributes<Model, T = ModelProperties<Model>> = {
    [K in keyof T as SnakeCase<K>]: DataValues
  };

  export type InlineAttributes<Model, T = ModelProperties<Model>> = {
    [K in keyof T as CamelCase<K>]: T[K]
  };

  export type InlineAddAttributes<Model> = OmitReadable<InlineAttributes<Model>>;

  export type InlineUpdateAttributes<Model> = Partial<OmitReadable<InlineAttributes<Model>>>;

  export type DataValues =
    string
    | number
    | boolean
    | DateTime
    | string[]
    | number[]
    | DateTime[]
    | boolean[]
    | Buffer
    | null;
}
