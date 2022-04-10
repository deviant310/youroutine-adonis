import {
  Repository,
  RepositoryProviderInferredAddAttributes,
  RepositoryProviderInferredUpdateAttributes,
  RepositoryProviderPlucked,
  RepositorySamplingClause,
} from '@ioc:Adonis/Core/Repository';

export default abstract class RedisRepository<Provider> implements Repository<Provider> {
  public add (attributes: RepositoryProviderInferredAddAttributes<Provider>) {
    return Promise.resolve(attributes);
  }

  public deleteById (id: string | number) {
    return Promise.resolve(id);
  }

  public getById (id: string | number): Promise<Provider | null> {
    return Promise.resolve(undefined);
  }

  public getByIdOrFail (id: string | number): Promise<Provider> {
    return Promise.resolve(undefined);
  }

  public getFirstOfList<Clause extends RepositorySamplingClause<Provider>> (clause: Clause): Promise<RepositoryProviderPlucked<Provider, Clause> | null> {
    return Promise.resolve(undefined);
  }

  public getFirstOfListOrFail<Clause extends RepositorySamplingClause<Provider>> (clause: Clause): Promise<RepositoryProviderPlucked<Provider, Clause>> {
    return Promise.resolve(undefined);
  }

  public getList<Clause extends RepositorySamplingClause<Provider>> (clause: Clause): Promise<RepositoryProviderPlucked<Provider, Clause>[] | never[]> {
    return Promise.resolve(undefined);
  }

  public updateById (id: string | number, attributes: RepositoryProviderInferredUpdateAttributes<Provider>): Promise<Provider> {
    return Promise.resolve(undefined);
  }
}
