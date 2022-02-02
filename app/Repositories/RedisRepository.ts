import { RepositoryContract, StrictValues } from '@ioc:Adonis/Core/Repository';

export default class RedisRepository implements RepositoryContract {
  create (attributes: object): object {
    return {};
  }

  findBy (key: string, value: StrictValues): object {
    return undefined;
  }

  findById (id: number): object {
    return undefined;
  }
}
