import { ApplicationContract } from '@ioc:Adonis/Core/Application'
//import AuthService from 'App/Services/AuthService'

export default class AppProvider {
  public static needsApplication = true

  constructor (protected app: ApplicationContract) {
  }

  public async register () {
    /*this.app.container.singleton('YouRoutine/Auth', () => {
      return new AuthService()
    })*/
    const { default: LucidRepository } = await import('App/Repositories/LucidRepository')

    const { default: User } = await import('App/Models/User')
    const { default: Session } = await import('App/Models/Session')
    const { default: Verification } = await import('App/Models/Verification')

    this.app.container
      .bind('YouRoutine/Repository/User', () => new LucidRepository(User.query()))
      .bind('YouRoutine/Repository/Session', () => new LucidRepository(Session.query()))
      .bind('YouRoutine/Repository/Verification', () => new LucidRepository(Verification.query()))
  }

  public async boot () {
    /**
     * Init default routes
     */
    const Route = this.app.container.use('Adonis/Core/Route')

    Route.get('/', async () => {})

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

  public async ready () {
    // App is ready
  }

  public async shutdown () {
    // Cleanup, since app is going down
  }
}
