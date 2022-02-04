declare module '@ioc:YouRoutine/Repository/User' {
  import AbstractLucidRepository, { LucidRepositoryContractTerms } from 'App/Repositories/LucidRepository';
  import UserData from 'App/Repositories/User/UserData';

  interface Terms extends LucidRepositoryContractTerms {
    persistedData: UserData;
    newData: Omit<UserData, 'id'|'updatedAt'|'createdAt'>;
  }

  const userRepo: AbstractLucidRepository<Terms>;
  export default userRepo;
}
