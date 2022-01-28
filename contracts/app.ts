declare module '@ioc:Adonis/Core/Application' {
  import AuthService from 'App/Services/Auth/AuthService'

  export interface ContainerBindings {
    'YouRoutine/Auth': AuthService;
  }
}

declare module '@ioc:YouRoutine/Core/Application' {
  export interface Repository {
    create(attributes: object): object
    toJSON(): object
  }

  export interface Service {}
}
