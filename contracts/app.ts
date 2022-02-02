declare module '@ioc:Adonis/Core/Application' {
  import userRepo from '@ioc:YouRoutine/Repository/User'

  export interface ContainerBindings {
    'YouRoutine/Repository/User': typeof userRepo;
    'YouRoutine/Repository/Session': LucidRepository<typeof Session, object>;
    'YouRoutine/Repository/Verification': LucidRepository<typeof Verification, object>;
  }
}
