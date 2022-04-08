import Hash from '@ioc:Adonis/Core/Hash';
import VerificationCode from 'App/Models/VerificationCode';
import { DateTime } from 'luxon';
import { BaseModel, beforeSave, column } from '@ioc:Adonis/Lucid/Orm';

export default class Registration extends BaseModel {
  @beforeSave()
  public static async hashVerificationCode (registration: Registration) {
    if(registration.$dirty.verificationCode)
      registration.verificationCodeHash = await Hash.make(registration.verificationCode.code);
  }

  @column({ isPrimary: true })
  public id!: number;

  @column()
  public userId!: number;

  public verificationCode!: VerificationCode;

  @column({ serializeAs: null })
  protected verificationCodeHash?: string;

  @column.dateTime()
  public expiresAt?: DateTime | null;

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt!: DateTime;
}
