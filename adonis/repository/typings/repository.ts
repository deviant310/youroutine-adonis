declare module '@ioc:Adonis/Core/Repository' {
  export interface RepositoryContract extends Function {
    prototype: RepositoryContractImpl;

    findById (id: string | number): RepositoryContractTerms['persistedData'] | null;

    findByIdOrFail (id: string | number): RepositoryContractTerms['persistedData'];

    findBy (key: string, value: StrictValues): RepositoryContractTerms['persistedData'] | null;

    findByOrFail (key: string, value: StrictValues): RepositoryContractTerms['persistedData'];

    create (attributes: RepositoryContractTerms['newData']): RepositoryContractTerms['persistedData'];
  }

  export interface RepositoryContractImpl {
    attributes: object;

    delete (): void;

    toJSON (): object;
  }

  export interface RepositoryContractTerms {
    persistedData: object;
    newData: object;
  }

  export type StrictValues = string | number | boolean | Date | string[] | number[] | Date[] | boolean[] | Buffer;
}
