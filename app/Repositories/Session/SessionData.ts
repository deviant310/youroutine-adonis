import { RepositoryData } from '@ioc:Adonis/Core/Repository';
import Session from 'App/Models/Session';

export interface PersistedData {
  id: Session['id'];
  userId: Session['userId'];
  accessToken: Session['accessToken'];
  meta?: Session['meta'];
  expiresAt?: Session['expiresAt'];
  createdAt: Session['createdAt'];
}

export type NewData = Omit<PersistedData, 'id'|'createdAt'>;

export default class SessionData implements RepositoryData {
  constructor (public data: PersistedData) {
  }

  public toJSON (): object {
    return {
      id: this.data.id,
      user_id: this.data.userId,
      access_token: this.data.accessToken,
      meta: this.data.meta,
      expires_at: this.data.expiresAt,
      created_at: this.data.createdAt,
    };
  }
}
