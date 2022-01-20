import { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class AppProvider {
  public static needsApplication = true

  constructor (protected app: ApplicationContract) {
  }

  public register () {

  }

  public async boot () {
    /*const { default: AuthService } = await import('App/Services/Auth/AuthService')
    const HttpContext = this.app.container.use('Adonis/Core/HttpContext')

    HttpContext.getter('auth', function auth () {
      return new AuthService(this)
    }, true)*/
  }

  public async ready () {
    // App is ready
  }

  public async shutdown () {
    // Cleanup, since app is going down
  }
}
