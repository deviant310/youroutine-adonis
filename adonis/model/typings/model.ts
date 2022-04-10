declare module '@ioc:Adonis/Core/Model' {
  import { DateTime } from 'luxon';
  import { CamelCase, SnakeCase } from 'type-fest';

  export type Model = {
    serialize (): SerializedAttributes<Model>;
  };

  export type Properties<M extends Model> = Pick<M, {
    [K in keyof M]: M[K] extends Function ? never : M[K] extends Values ? K : never;
  }[keyof M]>;

  export type Attributes<M extends Model, T = Properties<M>> = {
    [K in keyof T as CamelCase<K>]: T[K]
  };

  export type SerializedAttributes<M extends Model, T = Properties<M>> = {
    [K in keyof T as SnakeCase<K>]: T[K]
  };

  export type Values =
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
}
