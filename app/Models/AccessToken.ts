import { ModelResponseAttributes } from '@ioc:Adonis/Core/Model';
import Base64 from 'App/Helpers/Converters/Base64';
import BaseModel from 'App/Models/BaseModel';
import { DateTime } from 'luxon';

export enum AccessTokenType {
  Bearer = 'Bearer'
}

export default class AccessToken extends BaseModel<AccessToken> {
  private static readonly _convertIterationsCount = 2;

  private static getEncodedTokenFromTokenParts (type: AccessTokenType, tokenParts: string[]) {
    switch (type) {
      case AccessTokenType.Bearer: default:
        return Base64.encode(tokenParts.join('.'), AccessToken._convertIterationsCount);
    }
  }

  private static getTokenPartsFromEncodedToken (type: AccessTokenType, encodedToken: string) {
    switch (type) {
      case AccessTokenType.Bearer: default:
        return Base64.decode(encodedToken, AccessToken._convertIterationsCount).split('.');
    }
  }

  public static fromHeaderValue (headerValue: string): AccessToken {
    const [type, encodedToken] = headerValue.split(' ') as [AccessTokenType, string];

    const [uuid, token, expiresAtMillisString] = AccessToken
      .getTokenPartsFromEncodedToken(type, encodedToken);

    const expiresAt = expiresAtMillisString ? DateTime.fromMillis(Number(expiresAtMillisString)) : null;

    return new AccessToken({ uuid, type, token, expiresAt });
  }

  public uuid!: string;
  public type!: AccessTokenType;
  public token!: string;
  public expiresAt?: DateTime | null;

  public getEncodedToken (): string {
    return AccessToken
      .getEncodedTokenFromTokenParts(this.type, [
        this.uuid,
        this.token,
        this.expiresAt?.toJSDate().getTime().toString() || '',
      ]);
  }

  public hasExpired (): boolean {
    return this.expiresAt ? DateTime.now() > this.expiresAt : false;
  }

  // @TODO нужно избавиться от этого метода и найти другой способ сериализации данных
  public toJSON (): ModelResponseAttributes<AccessToken> {
    return {
      uuid: this.uuid,
      type: this.type,
      token: this.getEncodedToken(),
      expires_at: this.expiresAt,
    };
  }
}
