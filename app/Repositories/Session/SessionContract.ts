declare module '@ioc:YouRoutine/Repository/Session' {
  import AbstractLucidRepository, { LucidRepositoryContractTerms } from 'App/Repositories/LucidRepository';
  import { PersistedData, NewData } from 'App/Repositories/Session/SessionData';

  interface Terms extends LucidRepositoryContractTerms {
    persistedData: PersistedData;
    newData: NewData;
  }

  const sessionRepo: AbstractLucidRepository<Terms>;
  export default sessionRepo;
}
