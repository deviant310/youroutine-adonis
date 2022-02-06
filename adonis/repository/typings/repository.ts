declare module '@ioc:Adonis/Core/Repository' {
  export interface RepositoryStatic {
    new (building: object): Repository;

    findById<T extends RepositoryStatic> (this: T, id: string | number): Promise<InstanceType<T> | null>;

    findByIdOrFail<T extends RepositoryStatic> (this: T, id: string | number): Promise<InstanceType<T>>;

    findBy<T extends RepositoryStatic> (this: T, key: string, value: RepositoryStrictValues): Promise<InstanceType<T> | null>;

    findByOrFail<T extends RepositoryStatic> (this: T, key: string, value: RepositoryStrictValues): Promise<InstanceType<T>>;

    create<T extends RepositoryStatic> (this: T, attributes: object): Promise<InstanceType<T>>;
  }

  export interface Repository {
    attributes: object;

    delete (): Promise<void>;

    toJSON (): object;
  }

  export interface RepositoryTerms {
    builder: object;
    persistedAttributes: { [key: string]: unknown };
    fillAttributes: object;
    outputAttributes: object;
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
