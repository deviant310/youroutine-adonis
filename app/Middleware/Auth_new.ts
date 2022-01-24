import Application from '@ioc:Adonis/Core/Application'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Exception } from '@adonisjs/core/build/standalone'

/**
 * Auth middleware is meant to restrict un-authenticated access to a given route
 * or a group of routes.
 *
 * You must register this middleware inside `start/kernel.ts` file under the list
 * of named middleware.
 */
export default class AuthMiddleware {
  public async handle (ctx: HttpContextContract, next: () => Promise<void>) {
    try {
      await this.handleAuthorization(ctx, next)
    } catch (err) {
      if(Application.inProduction)
        throw new Exception('Unauthorized access', 403, 'E_UNAUTHORIZED_ACCESS')
      else
        throw err
    }
  }

  protected async handleAuthorization ({ auth, request }: HttpContextContract, next: () => Promise<void>) {
    const token = request.header('Authorization')?.split('Bearer ')?.[1]

    if (!token)
      throw new Exception('Bearer token is empty', 403, 'E_BEARER_TOKEN_EMPTY')

    await auth.authorizeByToken(token)
    await next()
  }
}
