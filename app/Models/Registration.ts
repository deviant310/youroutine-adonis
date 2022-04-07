import Hash from '@ioc:Adonis/Core/Hash';
import BaseModel from 'App/Models/BaseModel';
import VerificationCode from 'App/Models/VerificationCode';
import { DateTime } from 'luxon';

export default class Registration extends BaseModel<Registration> {
  public static async getVerificationCodeHash (verificationCode: VerificationCode): Promise<string> {
    return await Hash.make(verificationCode.code);
  }

  public readonly id!: number;
  public userId!: number;
  public verificationCodeHash!: string;
  public expiresAt?: DateTime | null;
  public readonly updatedAt!: DateTime;
  public readonly createdAt!: DateTime;

  public async verify (verificationCode: VerificationCode): Promise<boolean> {
    return await Hash.verify(this.verificationCodeHash, verificationCode.code);
  }
}

