declare module '@ioc:YouRoutine/Repositories' {
  import * as RepositoriesConstructors from 'App/Repositories';

  export type RepositoriesContainer = {
    [K in keyof typeof RepositoriesConstructors as Uncapitalize<K>]: InstanceType<typeof RepositoriesConstructors[K]>
  };

  const Repositories: RepositoriesContainer;
  export default Repositories;
}
