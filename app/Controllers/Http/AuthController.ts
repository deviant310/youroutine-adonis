import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthController {
  public async login ({ auth, request }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    const guard = auth.use('api')

    return await guard.attempt(email, password)
  }

  public async logout ({ auth }: HttpContextContract) {
    const guard = auth.use('api')

    await guard.logout()
  }
}
