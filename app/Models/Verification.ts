import { DateTime } from 'luxon';
import { BaseModel, beforeSave, column } from '@ioc:Adonis/Lucid/Orm';
import Hash from '@ioc:Adonis/Core/Hash';

export default class Verification extends BaseModel {
  @column({ isPrimary: true })
  public id!: number;

  @column()
  public userId!: number;

  @column({ serializeAs: null })
  public code!: string;

  @column.dateTime()
  public expiresAt?: DateTime | null;

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime;

  @beforeSave()
  public static async hashVerificationCode (verification: Verification): Promise<void> {
    if (verification.$dirty.code)
      verification.code = await Hash.make(verification.$dirty.code);
  }
}
