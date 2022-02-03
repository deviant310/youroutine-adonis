declare module '@ioc:YouRoutine/Repository/Verification' {
  import LucidRepository, { LucidRepositoryContractTerms } from 'App/Repositories/LucidRepository';
  import Verification from 'App/Models/Verification';

  export interface Data {
    id: Verification['id'];
    userId: Verification['userId'];
    code: Verification['code'];
    expiresAt?: Verification['expiresAt'];
    createdAt: Verification['createdAt'];
  }

  interface Terms extends LucidRepositoryContractTerms {
    persistedData: Data;
    newData: Omit<Data, 'id'|'createdAt'>;
  }

  const verificationRepo: LucidRepository<Terms>;
  export default verificationRepo;
}
