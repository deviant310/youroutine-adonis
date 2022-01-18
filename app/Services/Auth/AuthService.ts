import { base64, string } from '@ioc:Adonis/Core/Helpers'
import Hash from '@ioc:Adonis/Core/Hash'
import HttpContext from '@ioc:Adonis/Core/HttpContext'
import { Exception } from '@adonisjs/core/build/standalone'
import User from 'App/Models/User'
import Session from 'App/Models/Session'
import faker from 'faker'
import RegisteredSession from './RegisteredSession'

export default class AuthService {
  private readonly sessionIdEncodeIterationsCount = 7
  private readonly authTokenLength = 60

  public async register (phone: string) {
    const user = await User.findByOrFail('phone', phone)
      .catch(err => {
        throw new Exception('User not found', err.status, 'E_USER_NOT_FOUND')
      })

    const verificationCode = faker.datatype.number({ min: 100000, max: 999999 }).toString()

    console.log(verificationCode)

    const session = await Session.create({
      userId: user.id,
      verificationCode,
    })

    return new RegisteredSession(this.encodeSessionId(session.id), session.userId)
  }

  public async verify (sessionId: string, userId: number, verificationCode: string) {
    const session = await Session
      .query()
      .where(Session.primaryKey, this.decodeSessionId(sessionId))
      .where('user_id', userId)
      .firstOrFail()
      .catch(err => {
        throw new Exception('Session not found', err.status, 'E_SESSION_NOT_FOUND')
      })

    const codeIsVerified = await Hash.verify(session.verificationCode, verificationCode)

    if(codeIsVerified){
      session.accessToken = string.generateRandom(this.authTokenLength)
      session.save()

      return [sessionId, session.accessToken].join('.')
    } else {
      throw new Exception('Verification failed', 403, 'E_VERIFICATION_FAILED')
    }
  }

  public check(accessToken){
    const ctx = HttpContext.get()

    HttpContext.get().request.header('Authorization');
  }

  private encodeSessionId (sessionId: number): string {
    return [...Array(this.sessionIdEncodeIterationsCount).keys()]
      .reduce(base64.encode as (string) => string, sessionId.toString())
  }

  private decodeSessionId (sessionId: string): number {
    return parseInt([...Array(this.sessionIdEncodeIterationsCount).keys()]
      .reduce(base64.decode as (string) => string, sessionId))
  }
}
