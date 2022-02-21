declare module '@ioc:Adonis/Core/Model' {
  import { SnakeCase } from 'type-fest';

  export type Model = {
    toJSON (): ModelResponseAttributes<Model>;
  };

  export type ModelProperties<M extends Model> = Pick<M, {
    [K in keyof M]: M[K] extends Function ? never : M[K] extends ModelDataValues ? K : never;
  }[keyof M]>;

  export type ModelResponseAttributes<M extends Model, T = ModelProperties<M>> = Partial<{
    [K in keyof T as SnakeCase<K>]: T[K]
  }>;

  export type ModelDataValues =
    string
    | number
    | boolean
    | Date
    | string[]
    | number[]
    | Date[]
    | boolean[]
    | Buffer
    | null;
}
