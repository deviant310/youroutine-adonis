declare module '@ioc:Adonis/Core/Application' {
  import userRepo from '@ioc:YouRoutine/Repository/User';
  import sessionRepo from '@ioc:YouRoutine/Repository/Session';
  import verificationRepo from '@ioc:YouRoutine/Repository/Verification';

  export interface ContainerBindings {
    'YouRoutine/Repository/User': typeof userRepo;
    'YouRoutine/Repository/Session': typeof sessionRepo;
    'YouRoutine/Repository/Verification': typeof verificationRepo;
  }
}
