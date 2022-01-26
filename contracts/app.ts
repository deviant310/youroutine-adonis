declare module '@ioc:Adonis/Core/Application' {
  import AuthService from 'App/Services/Auth/AuthService'

  export interface ContainerBindings {
    'YouRoutine/Auth': AuthService;
  }
}
