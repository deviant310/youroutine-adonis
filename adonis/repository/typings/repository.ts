declare module '@ioc:Adonis/Core/Repository' {
  export interface Repository<DataProvider> {
    getById (id: string | number): Promise<DataProvider | null>;

    getByIdOrFail (id: string | number): Promise<DataProvider>;

    getFirstOfList<Clause extends RepositorySamplingClause<DataProvider>> (clause: Clause): Promise<RepositoryDataProviderPlucked<DataProvider, Clause> | null>;

    getFirstOfListOrFail<Clause extends RepositorySamplingClause<DataProvider>> (clause: Clause): Promise<RepositoryDataProviderPlucked<DataProvider, Clause>>;

    getList<Clause extends RepositorySamplingClause<DataProvider>> (clause: Clause): Promise<RepositoryDataProviderPlucked<DataProvider, Clause>[] | never[]>;

    add (attributes: RepositoryDataProviderAddAttributes<DataProvider>): Promise<DataProvider>;

    deleteById (id: string | number): Promise<void>;
  }

  export interface RepositoryConstructor {
    new<Data>(): Repository<Data>;
  }

  export type RepositoryDataProviderPlucked<DataProvider, Clause extends RepositorySamplingClause<DataProvider>> = Pick<DataProvider, Clause['select'][number] extends keyof DataProvider ? Clause['select'][number] : never>;

  export type RepositoryDataProviderProperties<DataProvider> = Pick<DataProvider, {
    [K in keyof DataProvider]: DataProvider[K] extends Function ? never : DataProvider[K] extends RepositoryDataValues ? K : never;
  }[keyof DataProvider]>;

  export interface RepositorySamplingClause<DataProvider> {
    readonly where: Readonly<Partial<RepositoryDataProviderProperties<DataProvider>>>;
    readonly select: readonly string[];
  }
  export type RepositoryDataProviderAddAttributes<DataProvider> = OmitReadable<RepositoryDataProviderProperties<DataProvider>>;

  export interface RepositoryRawData {
    [key: string]: RepositoryDataValues;
  }

  export type RepositoryDataValues =
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
