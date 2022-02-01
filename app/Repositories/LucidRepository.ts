import { LucidModel, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import { RepositoryContract, StrictValues } from '@ioc:Adonis/Core/Repository'

export default class LucidRepository<Model extends LucidModel> implements RepositoryContract {
  constructor (public query: ModelQueryBuilderContract<Model>) {}

  public async findById (id: number): Promise<object> {
    const row = await this.findBy(this.query.model.primaryKey, id)

    return row.toObject()
  }

  public async findBy (key: string, value: StrictValues) {
    const row = await this.query
      .where(key, value)
      .firstOrFail()

    return row.toObject()
  }

  public create (attributes: object): object {
    return attributes
  }
}
