import {
  IRepository,
  IRepositoryDataSamplingClause,
  IRepositoryPluckedData,
  IRepositoryStrictData,
} from '@ioc:Adonis/Core/Repository';

import Database from '@ioc:Adonis/Lucid/Database';

export default abstract class SQLRepository<Data> implements IRepository<Data> {
  protected db = Database;
  protected abstract table: string;

  public async getById (id: string | number): Promise<Data | null> {
    return await this.db
      .from(this.table)
      .where('id', id)
      .first();
  }

  public async getFirstOfList<Clause extends IRepositoryDataSamplingClause<Data>> ({ select, where }: Clause): Promise<IRepositoryPluckedData<Data, Clause> | null> {
    return await this.db
      .from(this.table)
      .select(select as string[])
      .where(where)
      .first();
  }

  public async getList<Clause extends IRepositoryDataSamplingClause<Data>> ({}: Clause): Promise<IRepositoryPluckedData<Data, Clause>[] | never[]> {
    return [];
  }

  public async add (attributes: OmitReadable<IRepositoryStrictData<Data>>): Promise<Data> {
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
