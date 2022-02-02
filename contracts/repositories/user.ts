declare module '@ioc:YouRoutine/Repository' {
  import LucidRepository from 'App/Repositories/LucidRepository';
  import User from 'App/Models/User';

  interface UserData {
    id: User['id'];
    phone: User['phone'];
    name: User['name'];
    surname: User['surname'];
    patronymic: User['patronymic'];
    createdAt: User['createdAt'];
    updatedAt: User['updatedAt'];
  }

  export const userRepo: LucidRepository<typeof User, UserData>;
}
