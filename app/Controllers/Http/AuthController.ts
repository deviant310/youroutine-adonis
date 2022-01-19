import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthController {
  public async register ({ auth, request }: HttpContextContract) {
    const phone = request.input('phone')

    return auth.register(phone)
  }

  public async verify ({ auth, request }: HttpContextContract) {
    const sessionId = request.input('session_id')
    const verificationCode = request.input('verification_code')

    return auth.verify(sessionId, verificationCode)
  }

  public async logout ({ auth }: HttpContextContract) {
    await auth.logout()
  }
}
