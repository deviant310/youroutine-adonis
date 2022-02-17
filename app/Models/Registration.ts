import Hash from '@ioc:Adonis/Core/Hash';
import BaseModel from 'App/Models/BaseModel';

export default class Registration extends BaseModel<Registration> {
  public readonly id!: number;
  public userId!: number;
  public verificationCode!: string;
  public expiresAt!: Date | null;
  public readonly createdAt!: Date;

  public async getVerificationCodeHash (): Promise<string> {
    return await Hash.make(this.verificationCode);
  }
}

