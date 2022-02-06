import Registration from 'App/Models/Registration';
import { DateTime } from 'luxon';

import LucidRepository, { LucidRepositoryTerms } from './LucidRepository';

interface PersistedAttributes {
  id: number;
  userId: number;
  verificationCode: string;
  expiresAt?: DateTime | null;
  createdAt: DateTime;
}

interface Terms extends LucidRepositoryTerms {
  builder: typeof Registration;
  persistedAttributes: PersistedAttributes;
  //fillAttributes: Omit<PersistedAttributes, 'id' | 'createdAt'>;
}

export default class RegistrationRepository extends LucidRepository<Terms>(Registration) {}
