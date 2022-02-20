import { Exception } from '@adonisjs/core/build/standalone';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Repositories from '@ioc:YouRoutine/Repositories';
import { generateAccessToken, generateVerificationCode } from 'App/Helpers/Generators';
import Registration from 'App/Models/Registration';
import Session, { SessionTokenType } from 'App/Models/Session';
import Token from 'App/Models/Token';
import VerificationCode from 'App/Models/VerificationCode';
import { createHash } from 'crypto';
import { DateTime } from 'luxon';

const { userRepository, sessionRepository, registrationRepository } = Repositories;

// @TODO В этом контроллере реализуем два метода, register и verify, аутентификацию по токену реализуем в middleware, получение текущего авторизованного пользователя реализуем в AuthProvider

export default class AuthController {
  public async register ({ request }: HttpContextContract): Promise<Registration> {
    const phone: string = request.input('phone');

    const user = await userRepository
      .getFirstOfListOrFail({
        select: ['id'] as const,
        where: { phone },
      });

    const verificationCode = new VerificationCode({ value: generateVerificationCode() });

    const registration = await registrationRepository
      .add({
        userId: user.id,
        verificationCodeHash: await verificationCode.getHashedValue(),
        expiresAt: null,
      });

    // @TODO здесь нужно инициировать отправку события типа onRegister
    console.log(registration, verificationCode);

    return registration;
  }

  public async verify ({ request }: HttpContextContract): Promise<Token> {
    const id = request.input('id');
    const verificationCode = request.input('verification_code');

    const registration = await registrationRepository.getByIdOrFail(id);

    if (registration.isExpired())
      throw new Exception('Verification code has expired', 403, 'E_VERIFICATION_CODE_EXPIRED');

    if (!(await registration.verify(verificationCode)))
      throw new Exception('Verification failed', 403, 'E_VERIFICATION_FAILED');

    await registrationRepository.deleteById(registration.id);

    const token = new Token({ value: generateAccessToken() });

    const session = await sessionRepository.add({
      userId: registration.userId,
      tokenHash: Session.makeTokenHash(token.value),
      tokenType: SessionTokenType.Bearer,
      meta: null,
      expiresAt: null,
    });

    // @TODO здесь нужно инициировать отправку события типа onVerify
    console.log(session, token);

    return token;
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
