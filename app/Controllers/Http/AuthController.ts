import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import AuthService from 'App/Services/Auth/AuthService'

export default class AuthController {
  public async register ({ request }: HttpContextContract) {
    const auth = new AuthService()

    const phone = request.input('phone')

    return auth.register(phone)
  }

  public async verify ({ request }: HttpContextContract) {
    const auth = new AuthService()

    const sessionId = request.input('session_id')
    const userId = request.input('user_id')
    const verificationCode = request.input('verification_code')

    return auth.verify(sessionId, userId, verificationCode)
  }

  public async logout ({ auth }: HttpContextContract) {
    const guard = auth.use('api')

    await guard.logout()
  }
}
