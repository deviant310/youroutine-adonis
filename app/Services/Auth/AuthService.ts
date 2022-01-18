import { base64, string } from '@ioc:Adonis/Core/Helpers'
import Hash from '@ioc:Adonis/Core/Hash'
import { Exception } from '@adonisjs/core/build/standalone'
import User from 'App/Models/User'
import Session from 'App/Models/Session'
import faker from 'faker'
import RegisteredSession from './RegisteredSession'
import VerifiedSession from './VerifiedSession'

export default class AuthService {
  private readonly sessionIdConvertIterationsCount = 6
  private readonly sessionIdConvertAsPartOfTokenIterationsCount = 2
  private readonly authTokenLength = 60

  public async register (phone: string) {
    const user = await User.findByOrFail('phone', phone)

    const verificationCode = faker.datatype.number({ min: 100000, max: 999999 }).toString()

    console.log(verificationCode)

    const session = await Session.create({
      userId: user.id,
      verificationCode,
    })

    return new RegisteredSession(
      AuthService.encodeSessionId(session.id, this.sessionIdConvertIterationsCount),
      session.userId
    )
  }

  public async verify (sessionId: string, verificationCode: string) {
    const session = await Session
      .findOrFail(AuthService.decodeSessionId(sessionId, this.sessionIdConvertIterationsCount))
      .catch(err => {
        throw new Exception('Session not found', err.status, err.code)
      })

    const codeIsVerified = await Hash.verify(session.verificationCode, verificationCode)

    if (codeIsVerified) {
      const accessToken = string.generateRandom(this.authTokenLength)

      session.accessToken = accessToken
      session.save()

      return new VerifiedSession(
        this.generatePublicAccessToken(session.id, accessToken),
      )
    } else {
      throw new Exception('Verification failed', 403, 'E_VERIFICATION_FAILED')
    }
  }

  public check (publicAccessToken: string) {
    const [ sessionId, accessToken ] = publicAccessToken.split('.')

    if(!sessionId || !accessToken) {
      throw new Exception('Session not found', 500, 'E_ACCESS_TOKEN_PARSE_ERROR')
    }
  }

  private static encodeSessionId (sessionId: number, iterationsCount: number): string {
    return [...Array(iterationsCount).keys()]
      .reduce(base64.encode as (str: string) => string, sessionId.toString())
  }

  private static decodeSessionId (sessionId: string, iterationsCount: number): number {
    return parseInt([...Array(iterationsCount).keys()]
      .reduce(base64.decode as (str: string) => string, sessionId))
  }

  private generatePublicAccessToken (sessionId: number, accessToken: string) {
    return [
      AuthService.encodeSessionId(sessionId, this.sessionIdConvertAsPartOfTokenIterationsCount),
      accessToken,
    ].join('.')
  }
}
