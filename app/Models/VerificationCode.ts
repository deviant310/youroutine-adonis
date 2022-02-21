import Hash from '@ioc:Adonis/Core/Hash';
import BaseModel from 'App/Models/BaseModel';

export default class VerificationCode extends BaseModel<VerificationCode> {
  public value!: string;
  public expiresAt!: Date | null;

  public async verify (hashedValue: string): Promise<boolean> {
    return await Hash.verify(hashedValue, this.value);
  }

  public async getHashedValue (): Promise<string> {
    return await Hash.make(this.value);
  }

  public isExpired (): boolean {
    return this.expiresAt ? new Date() > this.expiresAt : false;
  }
}
