import {
  LocalAttributes,
  DatabaseAttributes,
} from '@ioc:Adonis/Core/Repository';
import User from 'App/Models/User';
import { DateTime } from 'luxon';
import SQLRepository from './SQLRepository';

type UserDatabaseAttributes = Partial<DatabaseAttributes<User>>;
type UserLocalAttributes = Partial<LocalAttributes<User>>;

export default class UserRepository extends SQLRepository<User> {
  protected modelConstructor = User;
  protected table = 'users';
  protected keyName = 'id';

  protected getLocalAttributesFromDatabaseAttributes (attributes: UserDatabaseAttributes): UserLocalAttributes {
    return {
      id: attributes.id ? Number(attributes.id) : undefined,
      phone: attributes.phone ? String(attributes.phone) : undefined,
      name: attributes.name ? String(attributes.name) : undefined,
      surname: attributes.surname ? String(attributes.surname) : undefined,
      patronymic: attributes.patronymic ? String(attributes.patronymic) : undefined,
      updatedAt: attributes.updated_at ? DateTime.fromJSDate(attributes.updated_at as Date) : undefined,
      createdAt: attributes.created_at ? DateTime.fromJSDate(attributes.created_at as Date) : undefined,
    };
  }

  protected getDatabaseAttributesFromLocalAttributes (attributes: UserLocalAttributes): UserDatabaseAttributes {
    return {
      id: attributes.id,
      phone: attributes.phone,
      name: attributes.name,
      surname: attributes.surname,
      patronymic: attributes.patronymic,
      updated_at: attributes.updatedAt?.toJSDate(),
      created_at: attributes.createdAt?.toJSDate(),
    };
  }
}
