declare module '@ioc:Adonis/Core/Repository' {
  import { DateTime } from 'luxon';
  import { CamelCase, SnakeCase } from 'type-fest';

  export interface Repository {
    getByKey (key: string | number): Promise<any>;

    getByKeyOrFail (key: string | number): Promise<any>;

    getFirstOfList<Clause extends SamplingClause> (clause: Clause): Promise<any>;

    getFirstOfListOrFail<Clause extends SamplingClause> (clause: Clause): Promise<any>;

    getList<Clause extends SamplingClause> (clause: Clause): Promise<any>;

    create (attributes: any): Promise<any>;

    updateById (id: string | number, attributes: any): Promise<any>;

    deleteById (id: string | number): Promise<void>;
  }

  type DatabaseProperties<Entity> = Pick<Entity, {
    [K in keyof Entity]: Entity[K] extends Function ? never : K;
  }[keyof Entity]>;

  export interface SamplingClause<Properties = object> {
    readonly where: Readonly<Partial<Properties>>;
    readonly select: readonly (keyof Properties)[];
  }

  //export type DirtyAttributes<Attributes> = OmitReadable<Attributes>;

  /*export type EntityPlucked<Entity, Clause extends SamplingClause<Entity>> = Omit<Entity, keyof Omit<LocalProperties<Entity>, Clause['select'][number]>>;*/

  /*export type DatabaseAttributes<Entity, T = DatabaseProperties<Entity>> = {
    [K in keyof T as SnakeCase<K>]: DatabaseValues
  };*/

  /*export type LocalUpdateAttributes<Entity> = Partial<OmitReadable<LocalAttributes<Entity>>>;*/

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
