import { base64 } from '@ioc:Adonis/Core/Helpers';
import BaseModel from 'App/Models/BaseModel';

export enum SessionTokenType {
  Bearer = 'bearer'
}

type ISessionTokenData = {
  type: SessionTokenType;
  uuid: number;
  value: string;
  expiresAt?: Date | null;
};

export default class SessionToken extends BaseModel {
  private static readonly _uuidConvertIterationsCount = 2;

  public static createFromTokenByType (type: SessionTokenType, token: string): SessionToken {
    const [uuidEncoded, value] = token.split('.');

    const uuid = parseInt([...Array(SessionToken._uuidConvertIterationsCount).keys()]
      .reduce(str => base64.decode(str), uuidEncoded));

    return new this({ type, uuid, value });
  }

  public type: SessionTokenType;
  public token: string;
  public expiresAt?: Date | null;

  constructor ({ type, uuid, value, expiresAt }: ISessionTokenData) {
    super();

    this.type = type;
    this.token = this.buildTokenByType(type, uuid, value);
    this.expiresAt = expiresAt;
  }

  private buildTokenByType (type: SessionTokenType, uuid: number, value: string): string {
    switch (type){
      case SessionTokenType.Bearer: default:
        const uuidEncoded = [...Array(SessionToken._uuidConvertIterationsCount).keys()]
          .reduce(str => base64.encode(str), uuid.toString());

        return [uuidEncoded, value].join('.');
    }
  }
}
