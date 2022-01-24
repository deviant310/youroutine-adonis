declare module '@ioc:Adonis/Core/HttpContext' {
  import AuthService from 'App/Services/Auth/AuthService'

  interface HttpContextContract {
    auth: AuthService;
  }
}
