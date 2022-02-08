import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm';
import { DateTime } from 'luxon';

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
}
