declare module '@ioc:Adonis/Core/Repository' {
  export interface Repository<Data> {
    getById (id: string | number): Promise<Data | null>;

    getFirstOfList<Clause extends RepositoryDataSamplingClause<Data>> (clause: Clause): Promise<RepositoryPluckedData<Data, Clause> | null>;

    getList<Clause extends RepositoryDataSamplingClause<Data>> (clause: Clause): Promise<RepositoryPluckedData<Data, Clause>[] | never[]>;

    add (attributes: OmitReadable<RepositoryStrictData<Data>>): Promise<Data>;

    deleteById (id: string | number): Promise<void>;
  }

  export interface RepositoryConstructor {
    new<Data>(): Repository<Data>;
  }

  export type RepositoryPluckedData<Data, Clause extends RepositoryDataSamplingClause<Data>> = Pick<Data, Clause['select'][number] extends keyof Data ? Clause['select'][number] : never>;

  export type RepositoryStrictData<Data> = { [K in keyof Data]: Exclude<Data[K], null | undefined> };

  export interface RepositoryDataSamplingClause<Data> {
    readonly where: Readonly<Data>;
    readonly select: readonly string[];
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
