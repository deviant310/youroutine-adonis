import { base64 } from '@ioc:Adonis/Core/Helpers';
import BaseModel from 'App/Models/BaseModel';
import { createHash } from 'crypto';

export enum SessionTokenType {
  Bearer = 'bearer'
}

export default class Session extends BaseModel<Session> {
  private static readonly _uuidConvertIterationsCount = 2;

  public static getAttributesByPublicToken (publicToken: string) {
    const [idEncoded, token] = publicToken.split('.');

    const id = parseInt([...Array(Session._uuidConvertIterationsCount).keys()]
      .reduce(str => base64.decode(str), idEncoded));

    return { id, token } as Readonly<Pick<Session, 'id'|'token'>>;
  }

  public readonly id!: number;
  public userId!: number;
  public token!: string;
  public tokenType!: SessionTokenType;
  public meta?: string | null;
  public expiresAt?: Date | null;
  public readonly createdAt!: Date;

  public getTokenHash (): string {
    return createHash('sha256').update(this.token).digest('hex');
  }

  public getTokenPublic (): string {
    switch (this.tokenType) {
      case SessionTokenType.Bearer:
      default:
        const idEncoded = [...Array(Session._uuidConvertIterationsCount).keys()]
          .reduce(str => base64.encode(str), this.id.toString());

        return [idEncoded, this.token].join('.');
    }
  }
}
