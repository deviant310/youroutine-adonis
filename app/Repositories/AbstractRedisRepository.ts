import { RepositoryContract, StrictValues } from '@ioc:Adonis/Core/Repository';

export default abstract class AbstractRedisRepository implements RepositoryContract {
  public create (attributes: object): object {
    return attributes;
  }

  public findBy (key: string, value: StrictValues): object {
    return { key, value };
  }

  public findById (id: number): object {
    return { id };
  }

  public deleteById (id: string | number): void {
    console.log(id);
  }

  public findByIdOrFail (id: string | number): object {
    return { id };
  }

  public findByOrFail (key: string, value: StrictValues): object {
    return { key, value };
  }
}
