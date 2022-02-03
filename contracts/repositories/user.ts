declare module '@ioc:YouRoutine/Repository/User' {
  import LucidRepository, { LucidRepositoryContractTerms } from 'App/Repositories/LucidRepository';
  import User from 'App/Models/User';

  export interface Data {
    id: User['id'];
    phone: User['phone'];
    name?: User['name'];
    surname?: User['surname'];
    patronymic?: User['patronymic'];
    updatedAt: User['updatedAt'];
    createdAt: User['createdAt'];
  }

  interface Terms extends LucidRepositoryContractTerms {
    persistedData: Data;
    newData: Omit<Data, 'id'|'updatedAt'|'createdAt'>;
  }

  const userRepo: LucidRepository<Terms>;
  export default userRepo;
}
