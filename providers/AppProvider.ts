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
    const { LucidRepository } = await import('App/Repositories');
    const { User, Session, Verification } = await import('App/Models');

    this.app.container
      .bind('YouRoutine/Repository/User', () => new LucidRepository(User))
      .bind('YouRoutine/Repository/Session', () => new LucidRepository(Session))
      .bind('YouRoutine/Repository/Verification', () => new LucidRepository(Verification));
  }

  public async boot (): Promise<void> {
    /**
     * Init default routes
     */
    const Route = this.app.container.use('Adonis/Core/Route');

    Route.get('/', async () => {
    });

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
