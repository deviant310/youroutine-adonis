declare module '@ioc:YouRoutine/Repositories' {
  import * as RepositoriesConstructors from 'App/Repositories';

  type Container = {
    [K in keyof typeof RepositoriesConstructors]: InstanceType<typeof RepositoriesConstructors[K]>
  };

  const Repositories: Container;
  export default Repositories;
}
