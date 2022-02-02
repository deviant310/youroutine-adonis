import { DateTime } from 'luxon';
import { column, BaseModel } from '@ioc:Adonis/Lucid/Orm';

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id!: number;

  @column()
  public phone!: string;

  @column()
  public name?: string;

  @column()
  public surname?: string;

  @column()
  public patronymic?: string;

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt!: DateTime;
}
