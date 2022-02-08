import { base64, string } from '@ioc:Adonis/Core/Helpers';
import Session from 'App/Models/Session';
import { createHash } from 'crypto';
import { DateTime } from 'luxon';

import LucidRepository, { LucidRepositoryTerms } from './LucidRepository';

interface Attributes {
  readonly id: number;
  userId: number;
  readonly token: string;
  meta?: string | null;
  expiresAt?: DateTime | null;
  readonly createdAt: DateTime | null;
}
type Keys<T> = { [K in keyof T]: K }[keyof T]
type WritableOnly<T extends {[key: string]: any}, K extends keyof any> = Pick<T, Exclude<keyof T, K>> & { -readonly [Q in  K]: K[Q] }

interface Terms extends LucidRepositoryTerms {
  builder: typeof Session;
  attributes: Attributes;
}

export default class SessionRepository extends LucidRepository<Terms>(Session) {
  private static readonly _sessionIdConvertIterationsCount = 2;

  public static async findByBearerTokenOrFail<T extends typeof SessionRepository> (this: T, bearerToken: string) {
    const [idEncoded, token] = bearerToken.split('.');
    const id = parseInt([...Array(SessionRepository._sessionIdConvertIterationsCount).keys()]
      .reduce(str => base64.decode(str), idEncoded));
    const building = await this.findByOrFail(id);

    return new this(building) as InstanceType<T>;
  }

  public get bearerToken () {
    const idEncoded = [...Array(SessionRepository._sessionIdConvertIterationsCount).keys()]
      .reduce(str => base64.encode(str), this.attributes.id.toString());

    return [idEncoded, this.attributes.token].join('.');
  }

  // @TODO реализовать хук для возможности подстановки атрибутов перед сохранением
  @beforeCreate()
  public static async hashToken (session: SessionRepository): Promise<void> {
    if (session.$dirty.token)
      session.token = createHash('sha256').update(session.$dirty.token).digest('hex');
  }

  public static async create<T extends typeof SessionRepository> (this: T, attributes: OmitReadable<Attributes>) {
    return super.create({
      ...attributes,
      token: string.generateRandom(this._authTokenLength)
    });
  }
}
