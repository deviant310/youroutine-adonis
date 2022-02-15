import { ApplicationContract } from '@ioc:Adonis/Core/Application';
//import AuthService from 'App/Services/AuthService'

export default class RepositoryProvider {
  public static needsApplication = true;

  constructor (protected app: ApplicationContract) {
  }

  public async register (): Promise<void> {
    this.app.container.singleton('YouRoutine/Auth', async () => {
      const repositories = await import('App/Repositories');
      const { default: RepositoryManager } = await import('../src/RepositoryManager');

      return new RepositoryManager(repositories);
    });

    /**
     * Register repositories
     */
    const { UserRepository } = await import('App/Repositories');
    //const { User, Session, Registration } = await import('App/Models');
    this.app.container
      .bind('YouRoutine/Repository/User', () => new AbstractLucidRepository(User))
      .bind('YouRoutine/Repository/Session', () => new AbstractLucidRepository(Session))
      .bind('YouRoutine/Repository/Verification', () => new AbstractLucidRepository(Registration));
  }

  public async boot (): Promise<void> {

  }

  public async ready (): Promise<void> {
    // App is ready
  }

  public async shutdown (): Promise<void> {
    // Cleanup, since app is going down
  }
}
