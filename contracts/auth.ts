/**
 * Contract source: https://git.io/JOdz5
 *
 * Feel free to let us know via PR, if you find something broken in this
 * file.
 */

declare module '@ioc:Adonis/Addons/Auth' {
  import UserTest from 'App/Models/UserTest'

  /*
  |--------------------------------------------------------------------------
  | Providers
  |--------------------------------------------------------------------------
  |
  | The providers are used to fetch users. The Auth module comes pre-bundled
  | with two providers that are `Lucid` and `Database`. Both uses database
  | to fetch user details.
  |
  | You can also create and register your own custom providers.
  |
  */
  interface ProvidersList {
    /*
    |--------------------------------------------------------------------------
    | User Provider
    |--------------------------------------------------------------------------
    |
    | The following provider uses Lucid models as a driver for fetching user
    | details from the database for authentication.
    |
    | You can create multiple providers using the same underlying driver with
    | different Lucid models.
    |
    */
    user: {
      implementation: LucidProviderContract<typeof UserTest>
      config: LucidProviderConfig<typeof UserTest>
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Guards
  |--------------------------------------------------------------------------
  |
  | The guards are used for authenticating users using different drivers.
  | The auth module comes with 3 different guards.
  |
  | - SessionGuardContract
  | - BasicAuthGuardContract
  | - OATGuardContract ( Opaque access token )
  |
  | Every guard needs a provider for looking up users from the database.
  |
  */
  interface GuardsList {
    /*
    |--------------------------------------------------------------------------
    | OAT Guard
    |--------------------------------------------------------------------------
    |
    | OAT, stands for (Opaque access tokens) guard uses database backed tokens
    | to authenticate requests.
    |
    */
    api: {
      implementation: OATGuardContract<'user', 'api'>
      config: OATGuardConfig<'user'>
    }
  }
}

declare module '@ioc:YouRoutine/Auth' {
  import { DateTime } from 'luxon'
  import { Repository } from '@ioc:YouRoutine/Core/Application'

  interface Session {
    sessionId: string
  }

  interface Token {
    token: string
    expiresAt?: DateTime
  }

  export interface AuthRepository extends Repository {
    create(attributes: object): Session
  }

  export interface AuthService {
    register(phone: string): Session
    verify(sessionId: number, verificationCode: string): Token
  }
}
