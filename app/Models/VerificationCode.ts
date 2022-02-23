import BaseModel from 'App/Models/BaseModel';
import { DateTime } from 'luxon';

export default class VerificationCode extends BaseModel<VerificationCode> {
  public code!: string;
  public expiresAt?: DateTime | null;

  public hasExpired (): boolean {
    return this.expiresAt ? DateTime.now() > this.expiresAt : false;
  }
}
