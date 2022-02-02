declare module '@ioc:Adonis/Core/Repository' {
  import { StrictValues as LucidDatabaseStrictValues } from '@ioc:Adonis/Lucid/Database';

  export interface RepositoryContract {
    findById (id: number): object;
    findBy (key: string, value: StrictValues): object;
    create(attributes: object): object;
  }

  export type StrictValues = LucidDatabaseStrictValues;
}
