import User from 'App/Models/User';
import { RepositoryData } from '@ioc:Adonis/Core/Repository';

interface Data {
  id: User['id'];
  phone: User['phone'];
  name?: User['name'];
  surname?: User['surname'];
  patronymic?: User['patronymic'];
  updatedAt: User['updatedAt'];
  createdAt: User['createdAt'];
}

export default class UserData implements RepositoryData {
  constructor (public data: Data) {
  }

  public toJSON (): object {
    return {
      id: this.data.id,
      phone: this.data.phone,
      name: this.data.name,
      surname: this.data.surname,
      patronymic: this.data.patronymic,
      updated_at: this.data.updatedAt,
      created_at: this.data.createdAt,
    };
  }
}
