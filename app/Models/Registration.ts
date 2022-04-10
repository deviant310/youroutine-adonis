import Hash from '@ioc:Adonis/Core/Hash';
import { Attributes } from '@ioc:Adonis/Core/Model';
import BaseModel from 'App/Models/BaseModel';
import VerificationCode from 'App/Models/VerificationCode';
import { DateTime } from 'luxon';

export default class Registration extends BaseModel {
  public readonly id!: number;
  public userId!: number;
  public verificationCodeHash!: string;
  public expiresAt?: DateTime | null;
  public readonly updatedAt!: DateTime;
  public readonly createdAt!: DateTime;

  constructor (attributes: Attributes<Registration>) {
    super(attributes);
  }

  public async verify (verificationCode: VerificationCode): Promise<boolean> {
    return await Hash.verify(this.verificationCodeHash, verificationCode.code);
  }
}

