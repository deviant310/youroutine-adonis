import { DateTime } from 'luxon';
import { BaseModel, beforeSave, column } from '@ioc:Adonis/Lucid/Orm';
import Hash from '@ioc:Adonis/Core/Hash';

export default class Registration extends BaseModel {
  @column({ isPrimary: true })
  public id!: number;

  @column()
  public userId!: number;

  @column({ serializeAs: null })
  public verificationCode!: string;

  @column.dateTime()
  public expiresAt?: DateTime | null;

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime;

  @beforeSave()
  public static async hashVerificationCode (registration: Registration): Promise<void> {
    if (registration.$dirty.verificationCode)
      registration.verificationCode = await Hash.make(registration.$dirty.verificationCode);
  }
}
