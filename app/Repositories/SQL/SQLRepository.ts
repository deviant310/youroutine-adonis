import {
  IRepository,
  IRepositoryData,
  IRepositoryStrictData,
  IRepositoryDataSamplingClause,
} from '@ioc:Adonis/Core/Repository';
import { LucidModel, LucidRow } from '@ioc:Adonis/Lucid/Orm';

import Database from '@ioc:Adonis/Lucid/Database';

export default abstract class SQLRepository<Data extends IRepositoryData> implements IRepository<Data> {
  protected db = Database;
  protected abstract table: string;

  public static async getById<T extends typeof LucidRepository> (this: T, id: string | number) {
    const building = await builder.find(id);

    return building ? new this(building) as InstanceType<T> : null;
  }

  public static async getByIdOrFail<T extends typeof LucidRepository> (this: T, id: string | number) {
    const building = await builder.findOrFail(id);

    return new this(building) as InstanceType<T>;
  }

  public static async getBy<T extends typeof LucidRepository> (this: T, key: string, value: RepositoryStrictValues) {
    const building = await builder.findBy(key, value);

    return building ? new this(building) as InstanceType<T> : null;
  }

  public static async getByOrFail<T extends typeof LucidRepository> (this: T, key: string, value: RepositoryStrictValues) {
    const building = await builder.findByOrFail(key, value);

    return new this(building) as InstanceType<T>;
  }

  public static async create<T extends typeof LucidRepository> (this: T, attributes: OmitReadable<Terms['attributes']>) {
    // @TODO здесь необходимо вызывать декоратор атрибутов
    const repo: LucidRepository = Reflect.construct(this, []);
    builder.cre;
    const building = await builder.create(attributes as {});

    Reflect.defineProperty(repo, 'property1', { value: 42 });

    return repo as InstanceType<T>;
  }

  public getById (id: string | number) {
    return this.db
      .from(this.table)
      .where('id', id)
      .first() as Promise<Data>;
  }

  public getFirstOfList<Clause extends SamplingClause> (clause: Clause): Promise<Pick<Data, Clause['select'][number]> | null> {
    return Promise.resolve(undefined);
  }

  public getList<Clause extends SamplingClause> (clause: Clause): Data[] {
    return [];
  }

  public add (attributes: OmitReadable<RepositoryStrictData<Data>>): Promise<Data> {
    return this.db
      .table(this.table)
      .insert(attributes)
  }

  public deleteById (id: string | number): Promise<void> {
    return Promise.resolve(undefined);
  }

  public toJSON (): object {
    return this.building.toJSON();
  }
}
