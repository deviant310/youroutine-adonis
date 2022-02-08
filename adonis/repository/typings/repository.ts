declare module '@ioc:Adonis/Core/Repository' {
  export interface RepositoryStatic {
    new (building: object): Repository;

    getById<T extends RepositoryStatic> (this: T, id: string | number): Promise<InstanceType<T> | null>;

    getByIdOrFail<T extends RepositoryStatic> (this: T, id: string | number): Promise<InstanceType<T>>;

    create<T extends RepositoryStatic> (this: T, attributes: object): Promise<InstanceType<T>>;
  }

  export interface Repository {
    attributes: object;

    delete (): Promise<void>;

    toJSON (): object;
  }

  export interface RepositoryTerms {
    builder: object;
    attributes: object;
  }

  export type RepositoryStrictValues =
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
