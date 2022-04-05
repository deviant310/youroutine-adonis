import {
  InlineAttributes,
  DatabaseAttributes,
} from '@ioc:Adonis/Core/Repository';
import Session from 'App/Models/Session';
import { DateTime } from 'luxon';
import SQLRepository from './SQLRepository';

type SessionDatabaseAttributes = DatabaseAttributes<Session>;
type SessionInlineAttributes = InlineAttributes<Session>;

export default class SessionRepository extends SQLRepository<Session> {
  protected modelConstructor = Session;
  protected table = 'sessions';
  protected keyName = 'id';

  protected getInlineAttributesFromDatabaseAttributes (attributes: SessionDatabaseAttributes): SessionInlineAttributes {
    return {
      id: Number(attributes.id),
      userId: Number(attributes.user_id),
      accessToken: String(attributes.access_token),
      meta: String(attributes.meta),
      expiresAt: DateTime.fromISO(attributes.expires_at as string),
      updatedAt: DateTime.fromISO(attributes.updated_at as string),
      createdAt: DateTime.fromISO(attributes.created_at as string),
    };
  }

  protected getDatabaseAttributesFromInlineAttributes (attributes: SessionInlineAttributes): SessionDatabaseAttributes {
    return {
      id: attributes.id,
      user_id: attributes.userId,
      access_token: attributes.accessToken,
      meta: attributes.meta,
      expires_at: attributes.expiresAt,
      updated_at: attributes.updatedAt,
      created_at: attributes.createdAt,
    };
  }
}
