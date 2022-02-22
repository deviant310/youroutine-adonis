import BaseModel from 'App/Models/BaseModel';
import { createHash } from 'crypto';
import { DateTime } from 'luxon';

export default class Session extends BaseModel<Session> {
  public static makeAccessTokenHash (token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  public readonly id!: number;
  public userId!: number;
  public accessToken!: string;
  public meta!: string | null;
  public expiresAt!: DateTime | null;
  public readonly updatedAt!: DateTime;
  public readonly createdAt!: DateTime;

  public verifyAccessToken (token: string): boolean {
    return this.accessToken === createHash('sha256').update(token).digest('hex');
  }
}
