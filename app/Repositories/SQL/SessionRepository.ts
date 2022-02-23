import {
  RepositoryPersistedInferredAttributes,
  RepositoryProviderInferredAttributes,
} from '@ioc:Adonis/Core/Repository';
import Session from 'App/Models/Session';
import { DateTime } from 'luxon';
import SQLRepository from './SQLRepository';

type PersistableAttributes = Partial<RepositoryPersistedInferredAttributes<Session>>;
type ProviderAttributes = Partial<RepositoryProviderInferredAttributes<Session>>;

export default class SessionRepository extends SQLRepository<Session> {
  protected providerConstructor = Session;
  protected table = 'sessions';
  protected keyName = 'id';

  protected getProviderAttributesFromPersistableAttributes (attributes: PersistableAttributes): ProviderAttributes {
    return {
      id: attributes.id ? Number(attributes.id) : undefined,
      userId: attributes.user_id ? Number(attributes.user_id) : undefined,
      accessToken: attributes.access_token ? String(attributes.access_token) : undefined,
      meta: attributes.meta ? String(attributes.meta) : undefined,
      expiresAt: attributes.expires_at ? DateTime.fromJSDate(attributes.expires_at as Date) : undefined,
      updatedAt: attributes.updated_at ? DateTime.fromJSDate(attributes.updated_at as Date) : undefined,
      createdAt: attributes.created_at ? DateTime.fromJSDate(attributes.created_at as Date) : undefined,
    };
  }

  protected getPersistableAttributesFromProviderAttributes (attributes: ProviderAttributes): PersistableAttributes {
    return {
      id: attributes.id,
      user_id: attributes.userId,
      access_token: attributes.accessToken,
      meta: attributes.meta,
      expires_at: attributes.expiresAt?.toJSDate(),
      updated_at: attributes.updatedAt?.toJSDate(),
      created_at: attributes.createdAt?.toJSDate(),
    };
  }
}
