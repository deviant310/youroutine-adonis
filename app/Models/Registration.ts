import Hash from '@ioc:Adonis/Core/Hash';
import BaseModel from 'App/Models/BaseModel';

export default class Registration extends BaseModel<Registration> {
  public static async makeVerificationCodeHash (verificationCode: string): Promise<string> {
    return await Hash.make(verificationCode);
  }

  public readonly id!: number;
  public userId!: number;
  public verificationCodeHash!: string;
  public expiresAt!: Date | null;
  public readonly updatedAt!: Date;
  public readonly createdAt!: Date;

  public async verifyCode (verificationCode: string): Promise<boolean> {
    return await Hash.verify(this.verificationCodeHash, verificationCode);
  }
}

