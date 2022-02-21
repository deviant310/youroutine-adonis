import BaseModel from 'App/Models/BaseModel';
import { createHash } from 'crypto';

export default class Session extends BaseModel<Session> {
  public static makeAccessTokenHash (token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  public readonly id!: number;
  public userId!: number;
  public accessTokenHash!: string;
  public meta!: string | null;
  public expiresAt!: Date | null;
  public readonly updatedAt!: Date;
  public readonly createdAt!: Date;

  public verifyAccessToken (token: string): boolean {
    return this.accessTokenHash === createHash('sha256').update(token).digest('hex');
  }
}
