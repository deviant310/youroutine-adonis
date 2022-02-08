import { Repository, RepositoryStatic, RepositoryStrictValues, RepositoryTerms } from '@ioc:Adonis/Core/Repository';
import { LucidModel, LucidRow } from '@ioc:Adonis/Lucid/Orm';

export interface LucidRepositoryTerms extends RepositoryTerms {
  builder: LucidModel;
}

export default function LucidRepository<Terms extends LucidRepositoryTerms> (builder: Terms['builder']) {
  class LucidRepository implements Repository {
    public attributes: Terms['attributes'];

    constructor (private building: LucidRow) {
      this.attributes = building.toObject();
    }

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
    // @TODO реализовать сохранение передаваемых атрибутов в свойство объекта в качестве "грязных" атрибутов
    public static async create<T extends typeof LucidRepository> (this: T, attributes: OmitReadable<Terms['attributes']>) {
      // @TODO здесь необходимо вызывать декоратор атрибутов
      const building = await builder.create(attributes as {});

      const repo: LucidRepository = Reflect.construct(this, [building]);

      Reflect.defineProperty(repo, 'property1', { value: 42 });

      return repo as InstanceType<T>;
    }

    // @TODO Реализовать методы getList, getFirstOfList, getFirstOfListOrFail, методы getBy и getByOrFail убрать

    public async delete () {
      await this.building.delete();
    }

    public toJSON (): object {
      return this.building.toJSON();
    }
  }

  return LucidRepository as RepositoryStatic as typeof LucidRepository;
}
