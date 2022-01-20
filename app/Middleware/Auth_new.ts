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
  public async handle ({ auth }: HttpContextContract, next: () => Promise<void>) {
    if (await auth.check())
      await next()
    else
      throw new Exception('Unauthorized access', 403, 'E_UNAUTHORIZED_ACCESS')
  }
}
