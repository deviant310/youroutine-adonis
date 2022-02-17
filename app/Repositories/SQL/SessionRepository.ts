import { RepositoryRawData } from '@ioc:Adonis/Core/Repository';
import Session, { SessionTokenType } from 'App/Models/Session';
import SQLRepository from './SQLRepository';

export default class SessionRepository extends SQLRepository<Session> {
  protected table = 'sessions';

  protected getDataProviderByRawData (rawData: RepositoryRawData): Session {
    const {
      id: id,
      user_id: userId,
      created_at: createdAt,
    } = rawData;

    return new Session({
      id: id as number,
      userId: userId as number,
      tokenType: SessionTokenType.Bearer,
      createdAt: createdAt as Date,
    });
  }
}
