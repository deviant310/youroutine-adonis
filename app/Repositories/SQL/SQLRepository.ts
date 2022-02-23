import { Exception } from '@adonisjs/core/build/standalone';
import {
  Repository,
  RepositoryPersistedInferredAttributes,
  RepositoryProviderInferredAddAttributes,
  RepositoryProviderInferredAttributes,
  RepositoryProviderInferredUpdateAttributes,
  RepositoryProviderPlucked,
  RepositorySamplingClause,
} from '@ioc:Adonis/Core/Repository';
import Database, { DatabaseQueryBuilderContract, InsertQueryBuilderContract } from '@ioc:Adonis/Lucid/Database';
import { pickBy } from 'lodash';

export default abstract class SQLRepository<Provider> implements Repository<Provider> {
  protected db = Database;
  protected abstract providerConstructor: { new (...args: any): Provider };
  protected abstract table: string;
  protected abstract keyName: string;

  protected abstract getProviderAttributesFromPersistableAttributes (attributes: Partial<RepositoryPersistedInferredAttributes<Provider>>): Partial<RepositoryProviderInferredAttributes<Provider>>;

  protected abstract getPersistableAttributesFromProviderAttributes (attributes: Partial<RepositoryProviderInferredAttributes<Provider>>): Partial<RepositoryPersistedInferredAttributes<Provider>>;

  public async getById (id: string | number) {
    type QueryResult = Partial<RepositoryPersistedInferredAttributes<Provider>>;
    type Result = Provider;

    const query = this.db
      .from(this.table)
      .where(this.keyName, id) as
      DatabaseQueryBuilderContract<QueryResult>;

    const dbItem = await query.first();

    if (!dbItem) return null;

    const providerAttributes = pickBy(
      this.getProviderAttributesFromPersistableAttributes(dbItem),
      value => value !== undefined,
    );

    return new this.providerConstructor(providerAttributes) as Result;
  }

  public async getByIdOrFail (id: string | number) {
    const item = await this.getById(id);

    if (item === null)
      throw new Exception('Record not found');

    return item;
  }

  public async getFirstOfList<Clause extends RepositorySamplingClause<Provider>> (clause: Clause) {
    type QueryResult = Partial<RepositoryPersistedInferredAttributes<Provider>>;
    type Result = RepositoryProviderPlucked<Provider, Clause>;

    const { select, where } = clause;

    const query = this.db
      .from(this.table)
      .select(select as unknown as string[])
      .where(where) as
      DatabaseQueryBuilderContract<QueryResult>;

    const dbItem = await query.first();

    if (!dbItem) return null;

    const providerAttributes = pickBy(
      this.getProviderAttributesFromPersistableAttributes(dbItem),
      value => value !== undefined,
    );

    return new this.providerConstructor(providerAttributes) as Result;
  }

  public async getFirstOfListOrFail<Clause extends RepositorySamplingClause<Provider>> (clause: Clause) {
    const item = await this.getFirstOfList(clause);

    if (item === null)
      throw new Exception('Record not found');

    return item;
  }

  public async getList<Clause extends RepositorySamplingClause<Provider>> (clause: Clause) {
    type QueryResult = Partial<RepositoryPersistedInferredAttributes<Provider>>;
    type Result = RepositoryProviderPlucked<Provider, Clause>;

    const { select, where } = clause;

    const query = this.db
      .from(this.table)
      .select(select as unknown as string[])
      .where(where) as
      DatabaseQueryBuilderContract<QueryResult>;

    const dbItems = await query.exec();

    return dbItems.map(dbItem => {
      const providerAttributes = pickBy(
        this.getProviderAttributesFromPersistableAttributes(dbItem),
        value => value !== undefined,
      );

      return new this.providerConstructor(providerAttributes);
    }) as Result[];
  }

  public async add (attributes: RepositoryProviderInferredAddAttributes<Provider>) {
    type QueryResult = Partial<RepositoryPersistedInferredAttributes<Provider>>;
    type Result = Provider;

    const persistableAttributes = pickBy(
      this.getPersistableAttributesFromProviderAttributes(
        attributes as Partial<RepositoryProviderInferredAttributes<Provider>>,
      ),
      value => value !== undefined,
    );

    const query = this.db
      .table(this.table)
      .returning('*')
      .insert(persistableAttributes) as
      InsertQueryBuilderContract<QueryResult[]>;

    const dbItem = (await query.exec())[0];

    const providerAttributes = pickBy(
      this.getProviderAttributesFromPersistableAttributes(dbItem),
      value => value !== undefined,
    );

    return new this.providerConstructor(providerAttributes) as Result;
  }

  public async updateById (id: string | number, attributes: RepositoryProviderInferredUpdateAttributes<Provider>) {
    type QueryResult = Partial<RepositoryPersistedInferredAttributes<Provider>>;
    type Result = Provider;

    const persistableAttributes = this
      .getPersistableAttributesFromProviderAttributes(
        attributes as Partial<RepositoryProviderInferredAttributes<Provider>>,
      );

    const query = this.db
      .from(this.table)
      .where(this.keyName, id)
      .update(persistableAttributes) as
      DatabaseQueryBuilderContract<QueryResult>;

    const dbItem = (await query.exec())[0];

    const providerAttributes = pickBy(
      this.getProviderAttributesFromPersistableAttributes(dbItem),
      value => value !== undefined,
    );

    return new this.providerConstructor(providerAttributes) as Result;
  }

  public async deleteById (id: string | number) {
    await this.db
      .from(this.table)
      .where(this.keyName, id)
      .delete();
  }
}
