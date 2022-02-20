import Hash from '@ioc:Adonis/Core/Hash';
import BaseModel from 'App/Models/BaseModel';

export default class VerificationCode extends BaseModel<VerificationCode> {
  public readonly value!: string;
  public

  public async verify (plainValue: string): Promise<boolean> {
    return await Hash.verify(this.value, plainValue);
  }

  public async getHashedValue (): Promise<string> {
    return await Hash.make(this.value);
  }
}
