declare module '@ioc:Adonis/Core/Application' {
  import * as Repository from '@ioc:YouRoutine/Repository';

  export interface ContainerBindings {
    'YouRoutine/Repository': typeof Repository;
  }
}
