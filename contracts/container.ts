declare module '@ioc:Adonis/Core/Application' {
  import Repositories from '@ioc:YouRoutine/Repositories';

  interface ContainerBindings {
    'YouRoutine/Repositories': typeof Repositories;
  }
}
