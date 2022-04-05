import { Exception } from '@adonisjs/core/build/standalone';
import {
  InlineAddAttributes,
  InlineAttributes,
  ModelPlucked,
  InlineUpdateAttributes,
  Repository,
  SamplingClause,
  DatabaseAttributes,
} from '@ioc:Adonis/Core/Repository';
import Database from '@ioc:Adonis/Lucid/Database';

export default abstract class SQLRepository<Model> implements Repository<Model> {
  protected db = Database;
  protected abstract modelConstructor: { new (...args: any): Model };
  protected abstract table: string;
  protected abstract keyName: string;

  protected abstract getInlineAttributesFromDatabaseAttributes (
    attributes: DatabaseAttributes<Model>
  ): InlineAttributes<Model>;

  protected abstract getDatabaseAttributesFromInlineAttributes (
    attributes: Partial<InlineAttributes<Model>>
  ): DatabaseAttributes<Model>;

  public async getById (id: string | number): Promise<Model | null> {
    const storedAttributes = await this.db
      .from(this.table)
      .where(this.keyName, id)
      .first();

    const modelAttributes = this
      .getInlineAttributesFromDatabaseAttributes(storedAttributes);

    return new this.modelConstructor(modelAttributes);
  }

  public async getByIdOrFail (id: string | number): Promise<Model> {
    const item = await this.getById(id);

    if (item === null)
      throw new Exception('Record not found');

    return item;
  }

  public async getFirstOfList<Clause extends SamplingClause<Model>> (clause: Clause): Promise<ModelPlucked<Model, Clause> | null> {
    const { select, where } = clause;

    const storedAttributes = await this.db
      .from(this.table)
      .select(select as string[])
      .where(where)
      .first();

    const modelAttributes = this
      .getInlineAttributesFromDatabaseAttributes(storedAttributes);

    return new this.modelConstructor(modelAttributes);
  }

  public async getFirstOfListOrFail<Clause extends SamplingClause<Model>> (clause: Clause): Promise<ModelPlucked<Model, Clause>> {
    const item = await this.getFirstOfList(clause);

    if (item === null)
      throw new Exception('Record not found');

    return item;
  }

  public async getList<Clause extends SamplingClause<Model>> ({}: Clause): Promise<ModelPlucked<Model, Clause>[] | never[]> {
    return [];
  }

  public async add (attributes: InlineAddAttributes<Model>): Promise<Model> {
    const storableAttributes = this
      .getDatabaseAttributesFromInlineAttributes(attributes as Partial<InlineAttributes<Model>>);

    const storedAttributes = await this.db
      .table(this.table)
      .insert(storableAttributes)
      .exec();

    const modelAttributes = this
      .getInlineAttributesFromDatabaseAttributes(storedAttributes);

    return new this.modelConstructor(modelAttributes);
  }

  public async updateById (id: string | number, attributes: InlineUpdateAttributes<Model>): Promise<Model> {
    const persistableAttributes = this
      .getDatabaseAttributesFromInlineAttributes(attributes as Partial<InlineAttributes<Model>>);

    const storedAttributes = await this.db
      .from(this.table)
      .where(this.keyName, id)
      .update(persistableAttributes)
      .first();

    const modelAttributes = this
      .getInlineAttributesFromDatabaseAttributes(storedAttributes);

    return new this.modelConstructor(modelAttributes);
  }

  public async deleteById (id: string | number): Promise<void> {
    await this.db
      .from(this.table)
      .where(this.keyName, id)
      .delete();
  }
}
