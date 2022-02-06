import { Exception } from '@adonisjs/core/build/standalone';
import Hash from '@ioc:Adonis/Core/Hash';
import { string } from '@ioc:Adonis/Core/Helpers';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import RegistrationRepository from 'App/Repositories/RegistrationRepository';
import SessionRepository from 'App/Repositories/SessionRepository';
import UserRepository from 'App/Repositories/UserRepository';
import faker from 'faker';
import { DateTime } from 'luxon';

// @TODO В этом контроллере реализуем два метода, register и verify, аутентификацию по токену реализуем в middleware, получение текущего авторизованного пользователя реализуем в AuthProvider

export default class AuthController {

  private readonly _authTokenLength = 60;
  /*public async login ({ twoFactorAuth, request }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    return await auth.use('api').attempt(email, password, {
      expiresIn: '1mins',
    })
  }*/

  public async register ({ request }: HttpContextContract) {
    const phone = request.input('phone');

    const user = await UserRepository.findByOrFail('phone', phone);

    const verificationCode = faker
      .datatype
      .number({ min: 100000, max: 999999 })
      .toString();

    const registration = await RegistrationRepository
      .create({
        userId: user.attributes.id,
        verificationCode,
        expiresAt: new DateTime(),
      });

    // @TODO здесь нужно инициировать отправку события типа onRegister
    console.log(registration);

    return registration;
  }

  public async verify ({ request }: HttpContextContract) {
    const id = request.input('id');
    const verificationCode = request.input('verification_code');

    const registration = await RegistrationRepository.findByIdOrFail(id);

    if (registration.attributes.expiresAt && new DateTime() > registration.attributes.expiresAt)
      throw new Exception('Verification code has expired', 403, 'E_VERIFICATION_CODE_EXPIRED');

    const codeIsVerified = await Hash
      .verify(registration.attributes.verificationCode, verificationCode);

    if (!codeIsVerified)
      throw new Exception('Verification failed', 403, 'E_VERIFICATION_FAILED');

    await registration.delete();

    const session = await SessionRepository.create({
      userId: registration.attributes.userId,
      token: string.generateRandom(this._authTokenLength),
    });

    // @TODO здесь нужно инициировать отправку события типа onVerify
    console.log(session);

    return session;
  }
  // @TODO Необходимо понять где будет производиться проебразование accessToken в publicAccessToken и парсинг в обратную сторону
  public async logout ({ request }: HttpContextContract) {
    const token = request.header('Authorization')?.split('Bearer ')?.[1];
    await auth.logout();
  }

  public async session (): Promise<SessionData | null> {
    return this._sessionId ? sessionRepo.findById(this._sessionId) : null;
  }

  public async user (): Promise<UserData | null> {
    const session = await this.session();

    return session ? userRepo.findById(session.userId) : null;
  }

  public async authorizeUserBySession (sessionId: number, sessionAccessToken: string): Promise<void> {
    const session = await sessionRepo.findByIdOrFail(sessionId);

    if (session.expiresAt && new DateTime() > session.expiresAt)
      throw new Exception('Session has expired', 403, 'E_SESSION_EXPIRED');

    const sessionAccessTokenHash = createHash('sha256').update(sessionAccessToken).digest('hex');

    if (session.accessToken !== sessionAccessTokenHash)
      throw new Exception('Invalid access token', 403, 'E_ACCESS_TOKEN_INVALID');

    await this.loginByUserId(session.userId);
  }

  public async loginByUserId (userId: number): Promise<boolean> {
    const user = await userRepo.findById(userId);

    if (user) {
      this._user = user;

      return true;
    } else {
      return false;
    }
  }

  public async logout (): Promise<void> {
    /*if (this._session)
      await this._session.delete();

    this._session = undefined;
    this._user = undefined;*/
  }

  private generatePublicAccessToken (sessionId: number, rawAccessToken: string): string {

  }

  private parsePublicAccessToken (publicAccessToken: string): [number, string] {
    const [sessionIdEncoded, accessToken] = publicAccessToken.split('.');
    const sessionId = parseInt([...Array(this._accessTokenConvertIterationsCount).keys()]
      .reduce(str => base64.decode(str), sessionIdEncoded));

    return [sessionId, accessToken];
  }
}
