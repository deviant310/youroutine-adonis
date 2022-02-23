declare module '@ioc:Adonis/Core/Repository' {
  import { DateTime } from 'luxon';
  import { CamelCase, SnakeCase } from 'type-fest';

  export interface Repository<Provider> {
    getById (id: string | number): Promise<Provider | null>;

    getByIdOrFail (id: string | number): Promise<Provider>;

    getFirstOfList<Clause extends RepositorySamplingClause<Provider>> (clause: Clause): Promise<RepositoryProviderPlucked<Provider, Clause> | null>;

    getFirstOfListOrFail<Clause extends RepositorySamplingClause<Provider>> (clause: Clause): Promise<RepositoryProviderPlucked<Provider, Clause>>;

    getList<Clause extends RepositorySamplingClause<Provider>> (clause: Clause): Promise<RepositoryProviderPlucked<Provider, Clause>[] | never[]>;

    add (attributes: RepositoryProviderInferredAddAttributes<Provider>): Promise<Provider>;

    updateById (id: string | number, attributes: RepositoryProviderInferredUpdateAttributes<Provider>): Promise<Provider>;

    deleteById (id: string | number): Promise<void>;
  }

  type RepositoryProviderProperties<Provider> = Pick<Provider, {
    [K in keyof Provider]: Provider[K] extends Function ? never : Provider[K] extends RepositoryProviderValues ? K : never;
  }[keyof Provider]>;

  type RepositoryPersistedProperties<Provider> = Pick<Provider, {
    [K in keyof Provider]: Provider[K] extends Function ? never : K;
  }[keyof Provider]>;

  export interface RepositorySamplingClause<Provider> {
    readonly where: Readonly<Partial<RepositoryProviderProperties<Provider>>>;
    readonly select: readonly (keyof RepositoryProviderProperties<Provider>)[];
  }

  export type RepositoryProviderPlucked<Provider, Clause extends RepositorySamplingClause<Provider>> = Omit<Provider, keyof Omit<RepositoryProviderProperties<Provider>, Clause['select'][number]>>;

  export type RepositoryPersistedInferredAttributes<Provider, P = RepositoryPersistedProperties<Provider>> = {
    [K in keyof P as SnakeCase<K>]: RepositoryPersistedValues
  };

  export type RepositoryProviderInferredAttributes<Provider, P = RepositoryProviderProperties<Provider>> = {
    [K in keyof P as CamelCase<K>]: P[K]
  };

  export type RepositoryProviderInferredAddAttributes<Provider> = OmitReadable<RepositoryProviderInferredAttributes<Provider>>;

  export type RepositoryProviderInferredUpdateAttributes<Provider> = Partial<OmitReadable<RepositoryProviderInferredAttributes<Provider>>>;

  export type RepositoryProviderValues =
    string
    | number
    | boolean
    | DateTime
    | string[]
    | number[]
    | DateTime[]
    | boolean[]
    | Buffer
    | null
    | undefined;

  export type RepositoryPersistedValues =
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
