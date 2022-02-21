import BaseModel from 'App/Models/BaseModel';
import { createHash } from 'crypto';

export default class Session extends BaseModel<Session> {
  public readonly id!: number;
  public userId!: number;
  public tokenHash!: string;
  public meta!: string | null;
  public expiresAt!: Date | null;
  public readonly updatedAt!: Date;
  public readonly createdAt!: Date;
}
