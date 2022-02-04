import { RepositoryData } from '@ioc:Adonis/Core/Repository';
import Registration from 'App/Models/Registration';

interface Data {
  id: Registration['id'];
  userId: Registration['userId'];
  verificationCode: Registration['verificationCode'];
  expiresAt?: Registration['expiresAt'];
  createdAt: Registration['createdAt'];
}

export default class RegistrationData implements RepositoryData {
  constructor (public data: Data) {
  }

  public toJSON (): object {
    return {
      id: this.data.id,
      user_id: this.data.userId,
      verification_code: this.data.verificationCode,
      expires_at: this.data.expiresAt,
      created_at: this.data.createdAt,
    };
  }
}
