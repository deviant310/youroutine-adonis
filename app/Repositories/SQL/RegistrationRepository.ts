import {
  RepositoryPersistableAttributes,
  RepositoryProviderAttributes,
} from '@ioc:Adonis/Core/Repository';
import Registration from 'App/Models/Registration';
import SQLRepository from './SQLRepository';

type PersistableAttributes = RepositoryPersistableAttributes<Registration>;
type ProviderAttributes = RepositoryProviderAttributes<Registration>;

export default class RegistrationRepository extends SQLRepository<Registration> {
  protected providerConstructor = Registration;
  protected table = 'registrations';
  protected keyName = 'id';

  protected getDataProviderByPersistedItem (persistedItem: RepositoryPersistedItem): Registration {
    return new Registration({
      id: Number(persistedItem.id),
      userId: Number(persistedItem.user_id),
      verificationCodeHash: String(persistedItem.verification_code),
      expiresAt: new Date(persistedItem.expires_at as string),
      updatedAt: new Date(persistedItem.updated_at as string),
      createdAt: new Date(persistedItem.created_at as string),
    });
  }

  protected getPersistableAttributesFromProviderAttributes<T extends ProviderAttributes> (attributes: T): PersistedAttributes {
    return undefined;
  }

  protected getProviderAttributesFromPersistableAttributes<T extends PersistedAttributes> (attributes: T): ProviderAttributes {
    return undefined;
  }

  /*protected getRawDataByAttributes (provider: Registration): RepositoryRawData {
    return {
      id: provider.id,
      user_id: provider.userId,
      verification_code: provider.verificationCodeHash,
      expires_at: provider.expiresAt,
      created_at: provider.createdAt,
    };
  }*/
}
