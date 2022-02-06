import { BaseModel, column, beforeSave } from '@ioc:Adonis/Lucid/Orm';
import { DateTime } from 'luxon';
import { createHash } from 'crypto';

export default class Session extends BaseModel {
  @column({ isPrimary: true })
  public id!: number;

  @column()
  public userId!: number;

  @column({ serializeAs: null })
  public token!: string;

  @column()
  public meta?: string | null;

  @column.dateTime()
  public expiresAt?: DateTime | null;

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime;

  @beforeSave()
  public static async hashAccessToken (session: Session): Promise<void> {
    if (session.$dirty.token)
      session.token = createHash('sha256').update(session.$dirty.token).digest('hex');
  }
}
