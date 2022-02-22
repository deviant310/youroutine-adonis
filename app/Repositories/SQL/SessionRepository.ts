import {
  RepositoryPersistableAttributes,
  RepositoryProviderAttributes,
} from '@ioc:Adonis/Core/Repository';
import Session from 'App/Models/Session';
import { DateTime } from 'luxon';
import SQLRepository from './SQLRepository';

type PersistableAttributes = RepositoryPersistableAttributes<Session>;
type ProviderAttributes = RepositoryProviderAttributes<Session>;

export default class SessionRepository extends SQLRepository<Session> {
  protected providerConstructor = Session;
  protected table = 'sessions';
  protected keyName = 'id';

  protected getProviderAttributesFromPersistableAttributes (attributes: PersistableAttributes): ProviderAttributes {
    return {
      id: Number(attributes.id),
      userId: Number(attributes.user_id),
      accessToken: String(attributes.access_token),
      meta: String(attributes.meta),
      expiresAt: DateTime.fromISO(attributes.expires_at as string),
      updatedAt: DateTime.fromISO(attributes.updated_at as string),
      createdAt: DateTime.fromISO(attributes.created_at as string),
    };
  }

  protected getPersistableAttributesFromProviderAttributes (attributes: ProviderAttributes): PersistableAttributes {
    return {
      id: attributes.id,
      user_id: attributes.userId,
      access_token: attributes.accessToken,
      meta: attributes.meta,
      expires_at: attributes.expiresAt,
      updated_at: attributes.updatedAt,
      created_at: attributes.createdAt,
    };
  }
}
