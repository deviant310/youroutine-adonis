declare module '@ioc:Adonis/Core/Repository' {
  export interface IRepository<Data> {
    getById (id: string | number): Promise<Data | null>;

    getFirstOfList<Clause extends IRepositoryDataSamplingClause<Data>> (clause: Clause): Promise<IRepositoryPluckedData<Data, Clause> | null>;

    getList<Clause extends IRepositoryDataSamplingClause<Data>> (clause: Clause): Promise<IRepositoryPluckedData<Data, Clause>[] | never[]>;

    add (attributes: OmitReadable<IRepositoryStrictData<Data>>): Promise<Data>;

    deleteById (id: string | number): Promise<void>;
  }

  export type IRepositoryPluckedData<Data, Clause extends IRepositoryDataSamplingClause<Data>> = Pick<Data, Clause['select'][number] extends keyof Data ? Clause['select'][number] : never>;

  export type IRepositoryStrictData<Data> = { [K in keyof Data]: Exclude<Data[K], null | undefined> };

  export interface IRepositoryDataSamplingClause<Data> {
    readonly where: Readonly<Data>;
    readonly select: readonly string[];
  }

  export type IRepositoryDataValues =
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
