import { Exception } from '@adonisjs/core/build/standalone';
import Hash from '@ioc:Adonis/Core/Hash';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { generateVerificationCode } from 'App/Helpers/Generator';
import type Registration from 'App/Models/Registration';
import type Session from 'App/Models/Session';
import { DateTime } from 'luxon';
import Repositories from '@ioc:YouRoutine/Repositories';

const { UserRepository, RegistrationRepository } = Repositories;

// @TODO В этом контроллере реализуем два метода, register и verify, аутентификацию по токену реализуем в middleware, получение текущего авторизованного пользователя реализуем в AuthProvider

export default class AuthController {
  public async register ({ request }: HttpContextContract): Promise<Registration> {
    const phone: string = request.input('phone');

    const user = await UserRepository.getFirstOfListOrFail({
      select: ['id'] as const,
      where: { phone },
    });

    const registration = await RegistrationRepository
      .add({
        userId: user.id,
        verificationCode: generateVerificationCode(),
        expiresAt: new Date(),
      });

    // @TODO здесь нужно инициировать отправку события типа onRegister
    console.log(registration);

    return registration;
  }

  public async verify ({ request }: HttpContextContract): Promise<Session> {
    const id = request.input('id');
    const verificationCode = request.input('verification_code');

    const registration = await RegistrationRepository.getByIdOrFail(id);

    if (registration.expiresAt && new Date() > registration.expiresAt)
      throw new Exception('Verification code has expired', 403, 'E_VERIFICATION_CODE_EXPIRED');

    const codeIsVerified = await Hash
      .verify(registration.attributes.verificationCode, verificationCode);

    if (!codeIsVerified)
      throw new Exception('Verification failed', 403, 'E_VERIFICATION_FAILED');

    await registration.delete();

    const session = await SessionRepository.create({
      userId: registration.attributes.userId,
    });

    // @TODO здесь нужно инициировать отправку события типа onVerify
    console.log(session);

    return {
      token: this.bearerToken,
      ...this.attributes.expiresAt && { expires_at: this.attributes.expiresAt },
    };
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
