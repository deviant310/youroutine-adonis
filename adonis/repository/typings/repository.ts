declare module '@ioc:Adonis/Core/Repository' {
  export interface IRepository<Data extends IRepositoryData> {
    getById (id: string | number): Promise<Data> | Promise<null>;

    getFirstOfList<Clause extends IRepositoryDataSamplingClause> (clause: Clause): Promise<Pick<Data, Clause['select'][number]> | null>;

    getList<Clause extends IRepositoryDataSamplingClause> (clause: Clause): Data[];

    add (attributes: OmitReadable<IRepositoryStrictData<Data>>): Promise<Data>;

    deleteById (id: string | number): Promise<void>;

    toJSON (): object;
  }

  export interface IRepositoryData {
    [key: string]: IRepositoryDataValues;
  }

  export type IRepositoryStrictData<Data extends IRepositoryData> = { [K in keyof Data]: Exclude<Data[K], null | undefined> };

  export interface IRepositoryDataSamplingClause {
    readonly where: Readonly<IRepositoryData>;
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
