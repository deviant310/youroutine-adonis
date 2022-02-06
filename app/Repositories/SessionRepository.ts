import { base64 } from '@ioc:Adonis/Core/Helpers';
import Session from 'App/Models/Session';
import { DateTime } from 'luxon';

import LucidRepository, { LucidRepositoryTerms } from './LucidRepository';

type PersistedAttributes = {
  readonly id: number;
  userId: number;
  readonly token: string;
  meta?: string | null;
  expiresAt?: DateTime | null;
  readonly createdAt: DateTime | null;
}

type Al = PersistedAttributes;
type Wr = ReadonlyKeys<PersistedAttributes>;

interface OutputAttributes {
  token: string;
  expires_at?: DateTime;
}

interface Terms extends LucidRepositoryTerms {
  builder: typeof Session;
  persistedAttributes: PersistedAttributes;
  fillAttributes: Omit<PersistedAttributes, 'id' | 'token' | 'createdAt'>;
  outputAttributes: OutputAttributes;
}

export default class SessionRepository extends LucidRepository<Terms>(Session) {
  private readonly _accessTokenConvertIterationsCount = 2;

  public get accessToken () {
    const idEncoded = [...Array(this._accessTokenConvertIterationsCount).keys()]
      .reduce(str => base64.encode(str), this.attributes.id.toString());

    return [idEncoded, this.attributes.token].join('.');
  }

  // @TODO реализовать хук для возможности подстановки атрибутов перед сохранением

  public static async create(attributes){
    super.create()
  }

  public toJSON (): Terms['outputAttributes'] {
    return {
      token: this.accessToken,
      ...this.attributes.expiresAt && { expires_at: this.attributes.expiresAt },
    };
  }
}
