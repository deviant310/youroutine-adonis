import { Exception } from '@adonisjs/core/build/standalone';
import {
  Repository,
  RepositoryProviderAddAttributes,
  RepositoryProviderPlucked,
  RepositoryProviderUpdateAttributes,
  RepositoryPersistedAttributes,
  RepositorySamplingClause, RepositoryProviderAttributes,
} from '@ioc:Adonis/Core/Repository';
import Database from '@ioc:Adonis/Lucid/Database';

export default abstract class SQLRepository<Provider> implements Repository<Provider> {
  protected db = Database;
  protected abstract providerConstructor: { new(...args: any): Provider };
  protected abstract table: string;
  protected abstract keyName: string;

  protected abstract getProviderAttributesFromPersistableAttributes<T extends RepositoryPersistedAttributes<Provider>> (attributes: T): RepositoryProviderAttributes<Provider>;

  protected abstract getPersistableAttributesFromProviderAttributes<T extends RepositoryProviderAttributes<Provider>> (attributes: T): RepositoryPersistedAttributes<Provider>;

  public async getById (id: string | number): Promise<Provider | null> {
    const persistedAttributes = await this.db
      .from(this.table)
      .where(this.keyName, id)
      .first();

    const providerAttributes = this
      .getProviderAttributesFromPersistableAttributes(persistedAttributes);

    return new this.providerConstructor(providerAttributes);
  }

  public async getByIdOrFail (id: string | number): Promise<Provider> {
    const item = await this.getById(id);

    if (item === null)
      throw new Exception('Record not found');

    return item;
  }

  public async getFirstOfList<Clause extends RepositorySamplingClause<Provider>> (clause: Clause): Promise<RepositoryProviderPlucked<Provider, Clause> | null> {
    const { select, where } = clause;

    const persistedAttributes = await this.db
      .from(this.table)
      .select(select as string[])
      .where(where)
      .first();

    const providerAttributes = this
      .getProviderAttributesFromPersistableAttributes(persistedAttributes);

    return new this.providerConstructor(providerAttributes);
  }

  public async getFirstOfListOrFail<Clause extends RepositorySamplingClause<Provider>> (clause: Clause): Promise<RepositoryProviderPlucked<Provider, Clause>> {
    const item = await this.getFirstOfList(clause);

    if (item === null)
      throw new Exception('Record not found');

    return item;
  }

  public async getList<Clause extends RepositorySamplingClause<Provider>> ({}: Clause): Promise<RepositoryProviderPlucked<Provider, Clause>[] | never[]> {
    return [];
  }

  public async add (providerAddAttributes: RepositoryProviderAddAttributes<Provider>): Promise<Provider> {
    const persistableAttributes = this
      .getPersistableAttributesFromProviderAttributes(providerAddAttributes);

    const persistedAttributes = await this.db
      .table(this.table)
      .insert(persistableAttributes)
      .exec();

    const providerAttributes = this
      .getProviderAttributesFromPersistableAttributes(persistedAttributes);

    return new this.providerConstructor(providerAttributes);
  }

  public async updateById (id: string | number, attributes: RepositoryProviderUpdateAttributes<Provider>): Promise<Provider> {
    const persistedAttributes = await this.db
      .from(this.table)
      .where(this.keyName, id)
      .update(attributes)
      .first();

    const providerAttributes = this
      .getProviderAttributesFromPersistableAttributes(persistedAttributes);

    return new this.providerConstructor(providerAttributes);
  }

  public async deleteById (id: string | number): Promise<void> {
    await this.db
      .from(this.table)
      .where(this.keyName, id)
      .delete();
  }
}
