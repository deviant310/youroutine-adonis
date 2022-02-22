import Hash from '@ioc:Adonis/Core/Hash';
import BaseModel from 'App/Models/BaseModel';
import { DateTime } from 'luxon';

export default class Registration extends BaseModel<Registration> {
  public static async makeVerificationCodeHash (verificationCode: string): Promise<string> {
    return await Hash.make(verificationCode);
  }

  public readonly id!: number;
  public userId!: number;
  public verificationCodeHash!: string;
  public expiresAt!: DateTime | null;
  public readonly updatedAt!: DateTime;
  public readonly createdAt!: DateTime;

  public async verifyCode (verificationCode: string): Promise<boolean> {
    return await Hash.verify(this.verificationCodeHash, verificationCode);
  }
}

