import {
  RepositoryPersistedInferredAttributes,
  RepositoryProviderInferredAttributes,
} from '@ioc:Adonis/Core/Repository';
import User from 'App/Models/User';
import { DateTime } from 'luxon';
import SQLRepository from './SQLRepository';

type PersistableAttributes = Partial<RepositoryPersistedInferredAttributes<User>>;
type ProviderAttributes = Partial<RepositoryProviderInferredAttributes<User>>;

export default class UserRepository extends SQLRepository<User> {
  protected providerConstructor = User;
  protected table = 'users';
  protected keyName = 'id';

  protected getProviderAttributesFromPersistableAttributes (attributes: PersistableAttributes): ProviderAttributes {
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

  protected getPersistableAttributesFromProviderAttributes (attributes: ProviderAttributes): PersistableAttributes {
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
