declare module '@ioc:Adonis/Core/Application' {
  import { Repository } from '@ioc:Adonis/Core/Repository';
  interface ContainerBindings {
    'Adonis/Core/Repository': Repository<unknown>;
  }
}
