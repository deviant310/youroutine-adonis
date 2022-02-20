import { RepositoryPersistedAttributes, RepositoryProviderAttributes } from '@ioc:Adonis/Core/Repository';
import Session from 'App/Models/Session';
import SQLRepository from './SQLRepository';

type PersistedAttributes = RepositoryPersistedAttributes<Session>;
type ProviderAttributes = RepositoryProviderAttributes<Session>;

export default class SessionRepository extends SQLRepository<Session> {
  protected providerConstructor = Session;
  protected table = 'sessions';
  protected keyName = 'id';

  protected getProviderAttributesFromPersistableAttributes<T extends PersistedAttributes> (attributes: T): ProviderAttributes {
    return {
      id: attributes.id,
      userId: attributes.user_id,
      tokenHash: attributes.token_hash,
      tokenType: attributes.token_type,
      meta: attributes.meta,
      expiresAt: attributes.expires_at,
      updatedAt: attributes.updated_at,
      createdAt: attributes.created_at,
    };
  }

  protected getPersistableAttributesFromProviderAttributes<T extends ProviderAttributes>(attributes: T): PersistedAttributes {
    return {
      id: attributes.id,
      user_id: attributes.userId,
      token_hash: attributes.tokenHash,
      token_type: attributes.tokenType,
      meta: attributes.meta,
      expires_at: attributes.expiresAt,
      updated_at: attributes.updatedAt,
      created_at: attributes.createdAt,
    };
  }
}
