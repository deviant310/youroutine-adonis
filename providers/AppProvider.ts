import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import AuthService from 'App/Services/Auth/AuthService'

export default class AppProvider {
  public static needsApplication = true

  constructor (protected app: ApplicationContract) {
  }

  public register () {
    this.app.container.singleton('YouRoutine/Auth', () => {
      return new AuthService()
    })

    this.app.container.bind('')
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
    this.app.container.withBindings(['Adonis/Core/HttpContext', 'YouRoutine/Auth'], (HttpContext, auth) => {
      HttpContext.getter('auth', function auth() {
        return Auth.getAuthForRequest(this);
      }, true);
    });
    const auth = this.app.container.use('YouRoutine/Auth')
    const HttpContext = this.app.container.use('Adonis/Core/HttpContext')

    HttpContext.getter('auth', () => auth)
  }

  public async ready () {
    // App is ready
  }

  public async shutdown () {
    // Cleanup, since app is going down
  }
}
