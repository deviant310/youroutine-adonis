import BaseModel from 'App/Models/BaseModel';

export default class VerificationCode extends BaseModel<VerificationCode> {
  public code!: string;
  public expiresAt!: Date | null;

  public hasExpired (): boolean {
    return this.expiresAt ? new Date() > this.expiresAt : false;
  }
}
