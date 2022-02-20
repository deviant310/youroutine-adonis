import { base64 } from '@ioc:Adonis/Core/Helpers';
import BaseModel from 'App/Models/BaseModel';
import { createHash } from 'crypto';

export enum SessionTokenType {
  Bearer = 'bearer'
}

export default class Session extends BaseModel<Session> {
  private static readonly _uuidConvertIterationsCount = 2;

  public static parsePublicToken (publicToken: string): Readonly<[number, string]> {
    const [idEncoded, token] = publicToken.split('.');

    const id = parseInt([...Array(Session._uuidConvertIterationsCount).keys()]
      .reduce(str => base64.decode(str), idEncoded));

    return [id, token];
  }

  public static makeTokenHash (token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  public readonly id!: number;
  public userId!: number;
  public tokenHash!: string;
  public tokenType!: SessionTokenType;
  public meta!: string | null;
  public expiresAt!: Date | null;
  public readonly updatedAt!: Date;
  public readonly createdAt!: Date;

  public getTokenPublic (): string | null {
    if (!this.tokenRaw) return null;

    switch (this.tokenType) {
      case SessionTokenType.Bearer:
      default:
        const idEncoded = [...Array(Session._uuidConvertIterationsCount).keys()]
          .reduce(str => base64.encode(str), this.id.toString());

        return [idEncoded, this.tokenRaw].join('.');
    }
  }
}
