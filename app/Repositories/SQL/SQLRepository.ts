import { Exception } from '@adonisjs/core/build/standalone';
import {
  LocalAddAttributes,
  LocalAttributes,
  ModelPlucked,
  LocalUpdateAttributes,
  Repository,
  SamplingClause,
  DatabaseAttributes,
} from '@ioc:Adonis/Core/Repository';
import Database, { DatabaseQueryBuilderContract, InsertQueryBuilderContract } from '@ioc:Adonis/Lucid/Database';
import { LucidRow } from '@ioc:Adonis/Lucid/Orm';
import { pickBy } from 'lodash';

export default abstract class SQLRepository<Model> implements Repository<Model> {
  protected db = Database;
  protected abstract modelConstructor: { new (...args: any): Model };
  protected abstract table: string;
  protected abstract keyName: string;

  protected abstract getLocalAttributesFromDatabaseAttributes (
    attributes: Partial<DatabaseAttributes<Model>>
  ): Partial<LocalAttributes<Model>>;

  protected abstract getDatabaseAttributesFromLocalAttributes (
    attributes: Partial<LocalAttributes<Model>>
  ): Partial<DatabaseAttributes<Model>>;

  public async getById (id: string | number) {
    type QueryResult = Partial<DatabaseAttributes<Model>>;
    type Result = Model;

    const query = this.db
      .from(this.table)
      .where(this.keyName, id) as
      DatabaseQueryBuilderContract<QueryResult>;

    const dbItem = await query.first();

    if (!dbItem) return null;

    const attributes = pickBy(
      this.getLocalAttributesFromDatabaseAttributes(dbItem),
      value => value !== undefined,
    );

    return new this.modelConstructor(attributes) as Result;
  }

  public async getByIdOrFail (id: string | number) {
    const item = await this.getById(id);

    if (item === null)
      throw new Exception('Record not found');

    return item;
  }

  public async getFirstOfList<Clause extends SamplingClause<Model>> (clause: Clause) {
    type QueryResult = Partial<DatabaseAttributes<Model>>;
    type Result = ModelPlucked<Model, Clause>;

    const { select, where } = clause;

    const query = this.db
      .from(this.table)
      .select(select as unknown as string[])
      .where(where) as
      DatabaseQueryBuilderContract<QueryResult>;

    const dbItem = await query.first();

    if (!dbItem) return null;

    const attributes = pickBy(
      this.getLocalAttributesFromDatabaseAttributes(dbItem),
      value => value !== undefined,
    );

    return new this.modelConstructor(attributes) as Result;
  }

  public async getFirstOfListOrFail<Clause extends SamplingClause<Model>> (clause: Clause) {
    const item = await this.getFirstOfList(clause);

    if (item === null)
      throw new Exception('Record not found');

    return item;
  }

  public async getList<Clause extends SamplingClause<Model>> (clause: Clause) {
    type QueryResult = Partial<DatabaseAttributes<Model>>;
    type Result = ModelPlucked<Model, Clause>;

    const { select, where } = clause;

    const query = this.db
      .from(this.table)
      .select(select as unknown as string[])
      .where(where) as
      DatabaseQueryBuilderContract<QueryResult>;

    const dbItems = await query.exec();

    return dbItems.map(dbItem => {
      const attributes = pickBy(
        this.getLocalAttributesFromDatabaseAttributes(dbItem),
        value => value !== undefined,
      );

      return new this.modelConstructor(attributes);
    }) as Result[];
  }

  public async add (attributes: LocalAddAttributes<Model>) {
    type QueryResult = Partial<DatabaseAttributes<Model>>;
    type Result = Model;

    const storableAttributes = pickBy(
      this.getDatabaseAttributesFromLocalAttributes(
        attributes as Partial<LocalAttributes<Model>>,
      ),
      value => value !== undefined,
    );

    const query = this.db
      .table(this.table)
      .returning('*')
      .insert(storableAttributes) as
      InsertQueryBuilderContract<QueryResult[]>;

    const dbItem = (await query.exec())[0];

    const modelAttributes = pickBy(
      this.getLocalAttributesFromDatabaseAttributes(dbItem),
      value => value !== undefined,
    );

    return new this.modelConstructor(modelAttributes) as Result;
  }

  public async updateById (id: string | number, attributes: LocalUpdateAttributes<Model>) {
    type QueryResult = Partial<DatabaseAttributes<Model>>;
    type Result = Model;

    const storableAttributes = this
      .getDatabaseAttributesFromLocalAttributes(
        attributes as Partial<LocalAttributes<Model>>,
      );

    const query = this.db
      .from(this.table)
      .where(this.keyName, id)
      .update(storableAttributes) as
      DatabaseQueryBuilderContract<QueryResult>;

    const dbItem = (await query.exec())[0];

    const modelAttributes = pickBy(
      this.getLocalAttributesFromDatabaseAttributes(dbItem),
      value => value !== undefined,
    );

    return new this.modelConstructor(modelAttributes) as Result;
  }

  public async deleteById (id: string | number) {
    await this.db
      .from(this.table)
      .where(this.keyName, id)
      .delete();
  }
}
