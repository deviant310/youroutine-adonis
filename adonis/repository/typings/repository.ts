declare module '@ioc:Adonis/Core/Repository' {
  import { DateTime } from 'luxon';
  import { CamelCase, SnakeCase } from 'type-fest';

  export interface Repository<Provider> {
    getById (id: string | number): Promise<Provider | null>;

    getByIdOrFail (id: string | number): Promise<Provider>;

    getFirstOfList<Clause extends RepositorySamplingClause<Provider>> (clause: Clause): Promise<RepositoryProviderPlucked<Provider, Clause> | null>;

    getFirstOfListOrFail<Clause extends RepositorySamplingClause<Provider>> (clause: Clause): Promise<RepositoryProviderPlucked<Provider, Clause>>;

    getList<Clause extends RepositorySamplingClause<Provider>> (clause: Clause): Promise<RepositoryProviderPlucked<Provider, Clause>[] | never[]>;

    add (attributes: RepositoryProviderAddAttributes<Provider>): Promise<Provider>;

    updateById (id: string | number, attributes: RepositoryProviderUpdateAttributes<Provider>): Promise<Provider>;

    deleteById (id: string | number): Promise<void>;
  }

  export type RepositoryProviderPlucked<Provider, Clause extends RepositorySamplingClause<Provider>> = Pick<Provider, Clause['select'][number] extends keyof Provider ? Clause['select'][number] : never>;

  export type RepositoryProviderProperties<Provider> = Pick<Provider, {
    [K in keyof Provider]: Provider[K] extends Function ? never : Provider[K] extends RepositoryDataValues ? K : never;
  }[keyof Provider]>;

  export interface RepositorySamplingClause<Provider> {
    readonly where: Readonly<Partial<RepositoryProviderProperties<Provider>>>;
    readonly select: readonly string[];
  }

  export type RepositoryPersistableAttributes<Provider, T = RepositoryProviderProperties<Provider>> = {
    [K in keyof T as SnakeCase<K>]: RepositoryDataValues
  };

  export type RepositoryProviderAttributes<Provider, T = RepositoryProviderProperties<Provider>> = {
    [K in keyof T as CamelCase<K>]: T[K]
  };

  export type RepositoryProviderAddAttributes<Provider> = OmitReadable<RepositoryProviderAttributes<Provider>>;

  export type RepositoryProviderUpdateAttributes<Provider> = Partial<OmitReadable<RepositoryProviderAttributes<Provider>>>;

  export type RepositoryDataValues =
    string
    | number
    | boolean
    | DateTime
    | string[]
    | number[]
    | DateTime[]
    | boolean[]
    | Buffer
    | null;
}
