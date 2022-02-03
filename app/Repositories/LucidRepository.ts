import { LucidModel } from '@ioc:Adonis/Lucid/Orm';
import { RepositoryContract, RepositoryContractTerms, StrictValues } from '@ioc:Adonis/Core/Repository';

export interface LucidRepositoryContractTerms extends RepositoryContractTerms {
  storage: LucidModel;
}

export default class LucidRepository<Terms extends LucidRepositoryContractTerms> implements RepositoryContract {
  constructor (public model: Terms['storage']) {
  }

  public async findById (id: string | number): Promise<Terms['persistedData'] | null> {
    return await this.findBy(this.model.primaryKey, id);
  }

  public async findByIdOrFail (id: number): Promise<Terms['persistedData']> {
    return await this.findByOrFail(this.model.primaryKey, id);
  }

  public async findBy (key: string, value: StrictValues): Promise<Terms['persistedData'] | null> {
    const row = await this.model.findBy(key, value);

    return row ? row.toObject() as Terms['persistedData'] : null;
  }

  public async findByOrFail (key: string, value: StrictValues): Promise<Terms['persistedData']> {
    const row = await this.model.findByOrFail(key, value);

    return row.toObject() as Terms['persistedData'];
  }

  public async create (attributes: Terms['newData']): Promise<Terms['persistedData']> {
    const row = await this.model.create(attributes);

    return row.toObject() as Terms['persistedData'];
  }

  public async deleteById (id: number): Promise<void> {
    await this.model.query().where(this.model.primaryKey, id).delete();
  }
}
