import Registration from 'App/Models/Registration';
import { DateTime } from 'luxon';

import SQLRepository, { LucidRepositoryTerms } from './LucidRepository';

interface Attributes {
  readonly id: number;
  userId: number;
  verificationCode: string;
  expiresAt?: DateTime | null;
  readonly createdAt: DateTime;
}

interface Terms extends LucidRepositoryTerms {
  builder: typeof Registration;
  attributes: Attributes;
}

export default class RegistrationRepository extends SQLRepository<Terms>(Registration) {}