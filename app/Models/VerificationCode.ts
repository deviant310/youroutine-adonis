import Hash from '@ioc:Adonis/Core/Hash';
import BaseModel from 'App/Models/BaseModel';
import { DateTime } from 'luxon';

export default class VerificationCode extends BaseModel<VerificationCode> {
  public code!: string;
  public expiresAt?: DateTime | null;

  public async getHash () {
    return await Hash.make(this.code);
  }

  public hasExpired (): boolean {
    return this.expiresAt ? DateTime.now() > this.expiresAt : false;
  }
}
