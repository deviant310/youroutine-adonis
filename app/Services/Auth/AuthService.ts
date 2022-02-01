import { createHash } from 'crypto'
import faker from 'faker'
import { Exception } from '@adonisjs/core/build/standalone'
import Hash from '@ioc:Adonis/Core/Hash'
import { base64, string } from '@ioc:Adonis/Core/Helpers'
import { AuthRepository } from '@ioc:YouRoutine/Auth'
import User from 'App/Models/User'
import Session from 'App/Models/Session'
import RegisteredSession from './RegisteredSession'
import VerifiedSession from './VerifiedSession'

export default class AuthService {
  private _session?: Session
  private _user?: User
  private readonly _sessionIdConvertIterationsCount = 6
  private readonly _accessTokenConvertIterationsCount = 2
  private readonly _authTokenLength = 60
  // @TODO вынести методы в generatePublicAccessToken и parsePublicAccessToken соответственно, сделать их protected методами класса
  private static encodeSessionId (sessionId: number, iterationsCount: number): string {
    return [...Array(iterationsCount).keys()]
      .reduce(str => base64.encode(str), sessionId.toString())
  }

  private static decodeSessionId (sessionId: string, iterationsCount: number): number {
    return parseInt([...Array(iterationsCount).keys()]
      .reduce(str => base64.decode(str), sessionId))
  }

  private static generatePublicAccessToken (sessionId: number, accessToken: string, encodeIterationsCount: number) {
    const sessionIdEncoded = AuthService.encodeSessionId(sessionId, encodeIterationsCount)

    return [sessionIdEncoded, accessToken].join('.')
  }

  private static parsePublicAccessToken (publicAccessToken: string, decodeIterationsCount: number): [number, string] {
    const [sessionIdEncoded, accessToken] = publicAccessToken.split('.')
    const sessionId = AuthService.decodeSessionId(sessionIdEncoded, decodeIterationsCount)

    return [sessionId, accessToken]
  }

  constructor (protected repo: AuthRepository) {}

  public get session (): Session | undefined {
    return this._session
  }

  public get user (): User | undefined {
    return this._user
  }

  public async register (phone: string): Promise<RegisteredSession> {
    const user = await User.findByOrFail('phone', phone)

    const verificationCode = faker.datatype.number({ min: 100000, max: 999999 }).toString()
    // @TODO здесь нужно инициировать отправку события типа onRegister
    //console.log(verificationCode)
    // @TODO здесь будет задействован репозиторий verificationCodeRepo
    const session = await this.repo.create({
      userId: user.id,
      verificationCode,
    })
    // @TODO убрать encodeSessionId, возвращать только sessionId
    const sessionIdEncoded = AuthService.encodeSessionId(session.id, this._sessionIdConvertIterationsCount)

    return new RegisteredSession(sessionIdEncoded)
  }

  public async verify (sessionIdEncoded: string, verificationCode: string): Promise<VerifiedSession> {
    const sessionId = AuthService.decodeSessionId(sessionIdEncoded, this._sessionIdConvertIterationsCount)
    const session = await Session.findOrFail(sessionId)

    if(!session.verificationCode)
      throw new Exception('Verification code is empty', 403, 'E_VERIFICATION_CODE_EMPTY')

    /*if(!session.verificationCode)
      throw new Exception('Verification code has expired', 403, 'E_VERIFICATION_CODE_EXPIRED')*/

    const codeIsVerified = await Hash.verify(session.verificationCode, verificationCode)

    if (codeIsVerified) {
      const accessToken = string.generateRandom(this._authTokenLength)

      session.accessToken = accessToken
      session.verificationCode = null

      await session.save()

      const publicAccessToken = AuthService
        .generatePublicAccessToken(session.id, accessToken, this._accessTokenConvertIterationsCount)

      return new VerifiedSession(publicAccessToken)
    } else {
      throw new Exception('Verification failed', 403, 'E_VERIFICATION_FAILED')
    }
  }

  public async authorizeByToken (token: string): Promise<void> {
    const [sessionId, accessToken] = AuthService
      .parsePublicAccessToken(token, this._accessTokenConvertIterationsCount)

    if (!sessionId || !accessToken)
      throw new Exception('Error parsing public access token', 403, 'E_ACCESS_TOKEN_PARSE_ERROR')

    this._session = await Session.findOrFail(sessionId)

    if(this._session.accessToken !== createHash('sha256').update(accessToken).digest('hex'))
      throw new Exception('Wrong access token', 403, 'E_ACCESS_TOKEN_INVALID')

    await this.login(this._session.userId)
  }

  public async login (id: number) {
    this._user = await User.findOrFail(id)
  }

  public async logout () {
    if(this._session)
      await this._session.delete()

    this._session = undefined
    this._user = undefined
  }
}
