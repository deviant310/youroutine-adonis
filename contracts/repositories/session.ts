declare module '@ioc:YouRoutine/Repository/Session' {
  import LucidRepository, { LucidRepositoryContractTerms } from 'App/Repositories/LucidRepository';
  import Session from 'App/Models/Session';

  export interface Data {
    id: Session['id'];
    userId: Session['userId'];
    accessToken: Session['accessToken'];
    meta?: Session['meta'];
    expiresAt?: Session['expiresAt'];
    createdAt: Session['createdAt'];
  }

  interface Terms extends LucidRepositoryContractTerms {
    persistedData: Data;
    newData: Omit<Data, 'id'|'createdAt'>;
  }

  const sessionRepo: LucidRepository<Terms>;
  export default sessionRepo;
}
