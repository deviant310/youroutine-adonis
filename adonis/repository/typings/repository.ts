declare module '@ioc:Adonis/Core/Repository' {
  export interface RepositoryContract {
    findById (id: string | number): RepositoryContractTerms['persistedData'] | null;

    findByIdOrFail (id: string | number): RepositoryContractTerms['persistedData'];

    findBy (key: string, value: StrictValues): RepositoryContractTerms['persistedData'] | null;

    findByOrFail (key: string, value: StrictValues): RepositoryContractTerms['persistedData'];

    create (attributes: RepositoryContractTerms['newData']): RepositoryContractTerms['persistedData'];

    deleteById (id: string | number): void;
  }

  export interface RepositoryContractTerms {
    storage: object;
    persistedData: object;
    newData: object;
  }

  export type StrictValues = string | number | boolean | Date | string[] | number[] | Date[] | boolean[] | Buffer;
}
