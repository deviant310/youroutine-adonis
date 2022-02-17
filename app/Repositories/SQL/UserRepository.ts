import { RepositoryRawData } from '@ioc:Adonis/Core/Repository';
import User from 'App/Models/User';
import SQLRepository from './SQLRepository';

export default class UserRepository extends SQLRepository<User> {
  public table = 'users';

  protected getDataProviderByRawData (rawData: RepositoryRawData): User {
    const {
      id: id,
      phone: phone,
      name: name,
      surname: surname,
      patronymic: patronymic,
      updated_at: updatedAt,
      created_at: createdAt,
    } = rawData;

    return new User({
      id: id as number,
      phone: phone as string,
      name: name as string,
      surname: surname as string,
      patronymic: patronymic as string,
      updatedAt: updatedAt as Date,
      createdAt: createdAt as Date,
    });
  }
}
