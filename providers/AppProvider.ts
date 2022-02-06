import { ApplicationContract } from '@ioc:Adonis/Core/Application';
//import AuthService from 'App/Services/AuthService'

export default class AppProvider {
  public static needsApplication = true;

  constructor (protected app: ApplicationContract) {
  }

  public async register (): Promise<void> {
    /*this.app.container.singleton('YouRoutine/Auth', () => {
      return new AuthService()
    })*/

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
    /**
     * Init default routes
     */
    const Route = this.app.container.use('Adonis/Core/Route');

    Route.get('/', async () => null);

    /**
     * Init custom services
     */
    /*this.app.container.withBindings(['Adonis/Core/HttpContext', 'YouRoutine/Auth'], (HttpContext, auth) => {
      HttpContext.getter('auth', function auth() {
        return Auth.getAuthForRequest(this);
      }, true);
    });
    const auth = this.app.container.use('YouRoutine/Auth')
    const HttpContext = this.app.container.use('Adonis/Core/HttpContext')

    HttpContext.getter('auth', () => auth)*/
  }

  public async ready (): Promise<void> {
    // App is ready
  }

  public async shutdown (): Promise<void> {
    // Cleanup, since app is going down
  }
}
