import { RepositoryRawData } from '@ioc:Adonis/Core/Repository';
import Registration from 'App/Models/Registration';
import SQLRepository from './SQLRepository';

export default class RegistrationRepository extends SQLRepository<Registration> {
  public table = 'registrations';

  protected getDataProviderByRawData (rawData: RepositoryRawData): Registration {
    const {
      id: id,
      user_id: userId,
      verification_code: verificationCode,
      expires_at: expiresAt,
      created_at: createdAt,
    } = rawData;

    return new Registration({
      id: id as number,
      userId: userId as number,
      verificationCode: verificationCode as string,
      expiresAt: expiresAt as Date,
      createdAt: createdAt as Date,
    });
  }
}
