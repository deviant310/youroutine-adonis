import {
  Repository,
  RepositoryDataSamplingClause,
  RepositoryPluckedData,
  RepositoryStrictData,
} from '@ioc:Adonis/Core/Repository';
import Database from '@ioc:Adonis/Lucid/Database';

export default abstract class SQLRepository<Data> implements Repository<Data> {
  protected db = Database;
  protected abstract table: string;

  public async getById (id: string | number): Promise<Data | null> {
    return await this.db
      .from(this.table)
      .where('id', id)
      .first();
  }

  public async getFirstOfList<Clause extends RepositoryDataSamplingClause<Data>> ({ select, where }: Clause): Promise<RepositoryPluckedData<Data, Clause> | null> {
    return await this.db
      .from(this.table)
      .select(select as string[])
      .where(where)
      .first();
  }

  public async getList<Clause extends RepositoryDataSamplingClause<Data>> ({}: Clause): Promise<RepositoryPluckedData<Data, Clause>[] | never[]> {
    return [];
  }

  public async add (attributes: OmitReadable<RepositoryStrictData<Data>>): Promise<Data> {
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
