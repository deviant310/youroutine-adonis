import { base64 } from '@ioc:Adonis/Core/Helpers';
import { ModelResponseAttributes } from '@ioc:Adonis/Core/Model';
import BaseModel from 'App/Models/BaseModel';

export enum AccessTokenType {
  Bearer = 'Bearer'
}

export default class AccessToken extends BaseModel<AccessToken> {
  private static readonly _uuidConvertIterationsCount = 2;

  private static getEncodedTokenFromTokenParts (type: AccessTokenType, tokenParts: string[]) {
    switch (type) {
      case AccessTokenType.Bearer:
      default:
        return [...Array(AccessToken._uuidConvertIterationsCount).keys()]
          .reduce(str => base64.encode(str), tokenParts.join('.'));
    }
  }

  private static getTokenPartsFromEncodedToken (type: AccessTokenType, encodedToken: string) {
    switch (type) {
      case AccessTokenType.Bearer:
      default:
        return [...Array(AccessToken._uuidConvertIterationsCount).keys()]
          .reduce(str => base64.decode(str), encodedToken).split('.');
    }
  }

  public static fromHeaderValue (headerValue: string): AccessToken {
    const [type, encodedToken] = headerValue.split(' ') as [AccessTokenType, string];

    const [uuid, token, expiresAtTimestampString] = AccessToken
      .getTokenPartsFromEncodedToken(type, encodedToken);

    const expiresAt = expiresAtTimestampString ? new Date(Number(expiresAtTimestampString)) : null;

    return new AccessToken({ uuid, type, token, expiresAt });
  }

  public uuid!: string;
  public type!: AccessTokenType;
  public token!: string;
  public expiresAt!: Date | null;

  public getEncodedToken (): string {
    return AccessToken
      .getEncodedTokenFromTokenParts(this.type, [
        this.uuid,
        this.token,
        this.expiresAt?.getTime().toString() || '',
      ]);
  }

  public hasExpired (): boolean {
    return this.expiresAt ? new Date() > this.expiresAt : false;
  }

  public toJSON (): ModelResponseAttributes<AccessToken> {
    return {
      type: this.type,
      token: this.getEncodedToken(),
      expires_at: this.expiresAt,
    };
  }
}
