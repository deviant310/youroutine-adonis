import { RepositoryPersistedItem } from '@ioc:Adonis/Core/Repository';
import Registration from 'App/Models/Registration';
import SQLRepository from './SQLRepository';

export default class RegistrationRepository extends SQLRepository<Readonly<Registration>> {
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
