import BaseModel from 'App/Models/BaseModel';
import { DateTime } from 'luxon';

export default class User extends BaseModel<User> {
  public readonly id!: number;
  public phone!: string;
  public name?: string | null;
  public surname?: string | null;
  public patronymic?: string | null;
  public readonly updatedAt!: DateTime;
  public readonly createdAt!: DateTime;
}

