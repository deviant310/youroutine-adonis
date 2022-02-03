import { RepositoryContract, StrictValues } from '@ioc:Adonis/Core/Repository';

export default class RedisRepository implements RepositoryContract {
  public create (attributes: object): object {
    return attributes;
  }

  public findBy (key: string, value: StrictValues): object {
    return { key, value };
  }

  public findById (id: number): object {
    return { id };
  }
}
