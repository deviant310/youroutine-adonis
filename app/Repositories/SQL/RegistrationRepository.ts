import {
  DatabaseAttributes,
  LocalAttributes,
} from '@ioc:Adonis/Core/Repository';
import Registrati from 'App/Models/Registration';
import { DateTime } from 'luxon';
import SQLRepository from './SQLRepository';

type RegistrationDatabaseAttributes = Partial<DatabaseAttributes<Registrati>>;
type RegistrationLocalAttributes = Partial<LocalAttributes<Registrati>>;

export default class RegistrationRepository extends SQLRepository<Registrati> {
  protected modelConstructor = Registrati;
  protected table = 'registrations';
  protected keyName = 'id';

  protected getLocalAttributesFromDatabaseAttributes (attributes: RegistrationDatabaseAttributes): RegistrationLocalAttributes {
    return {
      id: attributes.id ? Number(attributes.id) : undefined,
      userId: attributes.user_id ? Number(attributes.user_id) : undefined,
      verificationCode: attributes.verification_code ? String(attributes.verification_code) : undefined,
      expiresAt: attributes.expires_at ? DateTime.fromJSDate(attributes.expires_at as Date) : undefined,
      updatedAt: attributes.updated_at ? DateTime.fromJSDate(attributes.updated_at as Date) : undefined,
      createdAt: attributes.created_at ? DateTime.fromJSDate(attributes.created_at as Date) : undefined,
    };
  }

  protected getDatabaseAttributesFromLocalAttributes (attributes: RegistrationLocalAttributes): RegistrationDatabaseAttributes {
    return {
      id: attributes.id,
      user_id: attributes.userId,
      verification_code: attributes.verificationCode,
      expires_at: attributes.expiresAt?.toJSDate(),
      updated_at: attributes.updatedAt?.toJSDate(),
      created_at: attributes.createdAt?.toJSDate(),
    };
  }
}
