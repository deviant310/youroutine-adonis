import { base64, string } from '@ioc:Adonis/Core/Helpers';
import Session from 'App/Models/Session';
import { createHash } from 'crypto';
import { DateTime } from 'luxon';

import SQLRepository, { LucidRepositoryTerms } from './LucidRepository';

export default class SessionRepository extends SQLRepository(Session) {
  private static readonly _sessionIdConvertIterationsCount = 2;
  private static readonly _tokenLength = 60;

  public static async getByBearerTokenOrFail<T extends typeof SessionRepository> (this: T, bearerToken: string) {
    const [idEncoded, token] = bearerToken.split('.');
    const id = parseInt([...Array(SessionRepository._sessionIdConvertIterationsCount).keys()]
      .reduce(str => base64.decode(str), idEncoded));
    const building = await this.findByOrFail(id);

    return new this(building) as InstanceType<T>;
  }

  public readonly id!: number;
  public userId!: number;
  public readonly token: string;
  public meta?: string | null;
  public expiresAt?: DateTime | null;
  public readonly createdAt!: DateTime | null;

  constructor () {
    super();

    this.token = string.generateRandom(SessionRepository._tokenLength);
  }

  public get bearerToken () {
    const idEncoded = [...Array(SessionRepository._sessionIdConvertIterationsCount).keys()]
      .reduce(str => base64.encode(str), this.attributes.id.toString());

    return [idEncoded, this.attributes.token].join('.');
  }

  // @TODO реализовать хук для возможности подстановки атрибутов перед сохранением
  public static async beforeCreate (session: SessionRepository): Promise<void> {
    if (session.dirty.token)
      session.token = createHash('sha256').update(session.dirty.token).digest('hex');
  }
}

type A = OmitReadable<SessionRepository>
