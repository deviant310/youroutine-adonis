import Hash from '@ioc:Adonis/Core/Hash';
import { base64 } from '@ioc:Adonis/Core/Helpers';
import BaseModel from 'App/Models/BaseModel';
import { createHash } from 'crypto';

export enum AccessTokenType {
  Bearer = 'Bearer'
}

export default class AccessToken extends BaseModel<AccessToken> {
  private static readonly _uuidConvertIterationsCount = 2;

  public static fromHeaderValue (headerValue: string): AccessToken {
    const [type, encodedValue] = headerValue.split(' ');

    const [value, expiresAt] = [...Array(AccessToken._uuidConvertIterationsCount).keys()]
      .reduce(str => base64.decode(str), encodedValue).split('.');

    return new AccessToken({
      type: type as AccessTokenType,
      value: value,
      expiresAt: expiresAt ? new Date(Number(expiresAt)) : null,
    });
  }

  public type!: AccessTokenType;
  public value!: string;
  public expiresAt!: Date | null;

  public getHeaderValue (): string {
    switch (this.type) {
      case AccessTokenType.Bearer:
      default:
        const encodedValue = [...Array(AccessToken._uuidConvertIterationsCount).keys()]
          .reduce(str => base64.encode(str), [this.value, this.expiresAt?.getTime() || ''].join('.'));

        return [this.type, encodedValue].join(' ');
    }
  }

  public async verify (hashedValue: string): Promise<boolean> {
    return await Hash.verify(hashedValue, this.value);
  }

  public getHashedValue (token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  public isExpired (): boolean {
    return this.expiresAt ? new Date() > this.expiresAt : false;
  }
}
