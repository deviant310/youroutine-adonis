declare module '@ioc:Adonis/Core/Repository' {
  export interface Repository<DataProvider> {
    getById (id: string | number): Promise<DataProvider | null>;

    getByIdOrFail (id: string | number): Promise<DataProvider>;

    getFirstOfList<Clause extends RepositoryDataSamplingClause<DataProvider>> (clause: Clause): Promise<RepositoryPluckedData<DataProvider, Clause> | null>;

    getFirstOfListOrFail<Clause extends RepositoryDataSamplingClause<DataProvider>> (clause: Clause): Promise<RepositoryPluckedData<DataProvider, Clause>>;

    getList<Clause extends RepositoryDataSamplingClause<DataProvider>> (clause: Clause): Promise<RepositoryPluckedData<DataProvider, Clause>[] | never[]>;

    add (attributes: OmitReadable<RepositoryDataProviderProperties<DataProvider>>): Promise<DataProvider>;

    deleteById (id: string | number): Promise<void>;
  }

  export interface RepositoryConstructor {
    new<Data>(): Repository<Data>;
  }

  export type RepositoryPluckedData<Data, Clause extends RepositoryDataSamplingClause<Data>> = Pick<Data, Clause['select'][number] extends keyof Data ? Clause['select'][number] : never>;

  export type RepositoryDataProviderProperties<Data> = Pick<Data, { [K in keyof Data]: Data[K] extends Function ? never : K }[keyof Data]>;

  export interface RepositoryDataSamplingClause<Data> {
    readonly where: Readonly<Partial<Data>>;
    readonly select: readonly string[];
  }

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
