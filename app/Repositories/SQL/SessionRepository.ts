import { base64, string } from '@ioc:Adonis/Core/Helpers';
import Session from 'App/Models/Session';
import { createHash } from 'crypto';
import { DateTime } from 'luxon';

import SQLRepository, { LucidRepositoryTerms } from './LucidRepository';

interface ISessionDTO {
  readonly id: number;
  userId: number;
  readonly token: string;
  meta?: string | null;
  expiresAt?: DateTime | null;
  readonly createdAt: DateTime | null;
}

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
