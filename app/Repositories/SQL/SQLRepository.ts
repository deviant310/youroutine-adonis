import { Exception } from '@adonisjs/core/build/standalone';
import {
  Repository,
  RepositoryDataProviderPlucked,
  RepositoryDataProviderAddAttributes,
  RepositorySamplingClause,
  RepositoryRawData,
} from '@ioc:Adonis/Core/Repository';
import Database from '@ioc:Adonis/Lucid/Database';

export default abstract class SQLRepository<DataProvider> implements Repository<DataProvider> {
  protected db = Database;
  protected abstract table: string;

  protected abstract getDataProviderByRawData (rawData: RepositoryRawData): DataProvider;

  public async getById (id: string | number): Promise<DataProvider | null> {
    const rawData = await this.db
      .from(this.table)
      .where('id', id)
      .first();

    return this.getDataProviderByRawData(rawData);
  }

  public async getByIdOrFail (id: string | number): Promise<DataProvider> {
    const item = await this.getById(id);

    if (item === null)
      throw new Exception('Record not found');

    return item;
  }

  public async getFirstOfList<Clause extends RepositorySamplingClause<DataProvider>> ({ select, where }: Clause): Promise<RepositoryDataProviderPlucked<DataProvider, Clause> | null> {
    return await this.db
      .from(this.table)
      .select(select as string[])
      .where(where)
      .first();
  }

  public async getFirstOfListOrFail<Clause extends RepositorySamplingClause<DataProvider>> (clause: Clause): Promise<RepositoryDataProviderPlucked<DataProvider, Clause>> {
    const item = await this.getFirstOfList(clause);

    if (item === null)
      throw new Exception('Record not found');

    return item;
  }

  public async getList<Clause extends RepositorySamplingClause<DataProvider>> ({}: Clause): Promise<RepositoryDataProviderPlucked<DataProvider, Clause>[] | never[]> {
    return [];
  }

  public async add (attributes: RepositoryDataProviderAddAttributes<DataProvider>): Promise<DataProvider> {
    return await this.db
      .table(this.table)
      .insert(attributes)
      .exec();
  }

  public async deleteById (id: string | number): Promise<void> {
    await this.db
      .from(this.table)
      .where('id', id)
      .delete();
  }
}
