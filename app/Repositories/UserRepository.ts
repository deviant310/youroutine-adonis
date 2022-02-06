import User from 'App/Models/User';
import { DateTime } from 'luxon';

import LucidRepository, { LucidRepositoryTerms } from './LucidRepository';

interface PersistedAttributes {
  id: number;
  phone: string;
  name?: string | null;
  surname?: string | null;
  patronymic?: string | null;
  updatedAt: DateTime;
  createdAt: DateTime;
}

interface Terms extends LucidRepositoryTerms {
  builder: typeof User;
  persistedAttributes: PersistedAttributes;
  fillAttributes: Omit<PersistedAttributes, 'id' | 'updatedAt' | 'createdAt'>;
}

export default class UserRepository extends LucidRepository<Terms>(User) {
}
