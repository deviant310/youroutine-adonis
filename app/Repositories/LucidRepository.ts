import { LucidModel, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import { RepositoryContract, StrictValues } from '@ioc:Adonis/Core/Repository'

export default class LucidRepository<Model extends LucidModel, Data extends object> implements RepositoryContract {
  constructor (public query: ModelQueryBuilderContract<Model>) {}

  public async findById (id: number): Promise<Data> {
    return await this.findBy(this.query.model.primaryKey, id)
  }

  public async findBy (key: string, value: StrictValues): Promise<Data> {
    const row = await this.query
      .where(key, value)
      .firstOrFail()

    return row.toObject() as Data
  }

  public create (attributes: object): object {
    return attributes
  }
}
