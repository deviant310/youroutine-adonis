import { Repository, RepositoryStatic, RepositoryStrictValues, RepositoryTerms } from '@ioc:Adonis/Core/Repository';
import { LucidModel, LucidRow } from '@ioc:Adonis/Lucid/Orm';

export interface LucidRepositoryTerms extends RepositoryTerms {
  builder: LucidModel;
}

export default function LucidRepository<Terms extends LucidRepositoryTerms> (builder: Terms['builder']) {
  class LucidRepository implements Repository {
    public attributes: Terms['persistedAttributes'];
    public filledAttributes: Terms['fillAttributes'];

    constructor (private building: LucidRow) {
      this.attributes = building.toObject();
    }

    public static async findById<T extends typeof LucidRepository> (this: T, id: string | number) {
      const building = await builder.find(id);

      return building ? new this(building) as InstanceType<T> : null;
    }

    public static async findByIdOrFail<T extends typeof LucidRepository> (this: T, id: string | number) {
      const building = await builder.findOrFail(id);

      return new this(building) as InstanceType<T>;
    }

    public static async findBy<T extends typeof LucidRepository> (this: T, key: string, value: RepositoryStrictValues) {
      const building = await builder.findBy(key, value);

      return building ? new this(building) as InstanceType<T> : null;
    }

    public static async findByOrFail<T extends typeof LucidRepository> (this: T, key: string, value: RepositoryStrictValues) {
      const building = await builder.findByOrFail(key, value);

      return new this(building) as InstanceType<T>;
    }
    // @TODO реализовать сохранение передаваемых атрибутов в свойство объекта в качестве "грязных" атрибутов
    public static async create<T extends typeof LucidRepository> (this: T, attributes: Pick<Terms['persistedAttributes'], WritableKeys<Terms['persistedAttributes']>>) {
      const x = attributes;
      x.
      const building = await builder.create(attributes);

      const repo = Reflect.construct(this, [building]);

      Reflect.defineProperty(repo, 'property1', { value: 42 });

      return new this(building) as InstanceType<T>;
    }

    public async delete () {
      await this.building.delete();
    }

    public toJSON (): Terms['outputAttributes'] {
      return this.building.toJSON();
    }
  }

  return LucidRepository as RepositoryStatic as typeof LucidRepository;
}
