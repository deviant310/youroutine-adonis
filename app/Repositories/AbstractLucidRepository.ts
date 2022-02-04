import { LucidModel } from '@ioc:Adonis/Lucid/Orm';
import {
  RepositoryContract,
  RepositoryContractImpl,
  RepositoryContractTerms,
  StrictValues,
} from '@ioc:Adonis/Core/Repository';

abstract class LucidRepository<Terms extends RepositoryContractTerms> implements RepositoryContractImpl {
  public attributes: Terms['persistedData'];
  private static model: LucidModel;

  public static async findById (id: string | number): Promise<Terms['persistedData'] | null> {
    const repo = new this();
    return await this.findBy(this.model.primaryKey, id);
  }

  public static async findByIdOrFail (id: number): Promise<Terms['persistedData']> {
    return await this.findByOrFail(this.model.primaryKey, id);
  }

  public static async findBy (key: string, value: StrictValues): Promise<Terms['persistedData'] | null> {
    const row = await this.model.findBy(key, value);

    return row ? row.toObject() as Terms['persistedData'] : null;
  }

  public static async findByOrFail (key: string, value: StrictValues): Promise<Terms['persistedData']> {
    const row = await this.model.findByOrFail(key, value);

    return row.toObject() as Terms['persistedData'];
  }

  public static async create (attributes: Terms['newData']): Promise<Terms['persistedData']> {
    const row = await this.model.create(attributes);

    return row.toObject() as Terms['persistedData'];
  }

  public async delete (): Promise<void> {
    await (this.constructor as typeof AbstractLucidRepository).model.query().where(this.model.primaryKey, id).delete();
  }

  public abstract toJSON (): object;
}

const AbstractLucidRepository: RepositoryContract = LucidRepository;
export default AbstractLucidRepository;
