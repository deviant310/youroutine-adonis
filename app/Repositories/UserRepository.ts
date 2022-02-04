import User from 'App/Models/User';

import AbstractLucidRepository from './AbstractLucidRepository';

interface PersistedData {
  id: User['id'];
  phone: User['phone'];
  name?: User['name'];
  surname?: User['surname'];
  patronymic?: User['patronymic'];
  updatedAt: User['updatedAt'];
  createdAt: User['createdAt'];
}

interface Terms {
  persistedData: PersistedData;
  newData: Omit<PersistedData, 'id'|'updatedAt'|'createdAt'>;
}

export default class UserRepository extends AbstractLucidRepository<Terms> {
  public data = {
    toJSON (): object {
      return {
        id: this.data.id,
        phone: this.data.phone,
        name: this.data.name,
        surname: this.data.surname,
        patronymic: this.data.patronymic,
        updated_at: this.data.updatedAt,
        created_at: this.data.createdAt,
      };
    },
  };
  protected model = User;
}
