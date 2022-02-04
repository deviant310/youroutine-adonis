declare module '@ioc:YouRoutine/Repository/Registration' {
  import AbstractLucidRepository, { LucidRepositoryContractTerms } from 'App/Repositories/LucidRepository';
  import RegistrationData from 'App/Repositories/Registration/RegistrationData';

  interface Terms extends LucidRepositoryContractTerms {
    persistedData: RegistrationData;
    newData: Omit<RegistrationData, 'id'|'createdAt'>;
  }

  const registrationRepo: AbstractLucidRepository<Terms>;
  export default registrationRepo;
}
