import { Exception } from '@adonisjs/core/build/standalone';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Repositories from '@ioc:YouRoutine/Repositories';
import { generateAccessToken, generateVerificationCode } from 'App/Helpers/Generators';
import AccessToken, { AccessTokenType } from 'App/Models/AccessToken';
import Registration from 'App/Models/Registration';
import Session from 'App/Models/Session';
import VerificationCode from 'App/Models/VerificationCode';
import { DateTime } from 'luxon';

const { userRepository, sessionRepository, registrationRepository } = Repositories;

// @TODO В этом контроллере реализуем два метода, register и verify, аутентификацию по токену реализуем в middleware, получение текущего авторизованного пользователя реализуем в AuthProvider

export default class AuthController {
  public async register ({ request }: HttpContextContract): Promise<Registration> {
    const phone: string = request.input('phone');
    const verificationCode = new VerificationCode({
      code: generateVerificationCode(),
      expiresAt: DateTime.now().plus({ minutes: 5 }),
    });

    const user = await userRepository
      .getFirstOfListOrFail({
        select: ['id'] as const,
        where: { phone },
      });

    const registration = await registrationRepository
      .create({
        userId: user.id,
        verificationCodeHash: await verificationCode.getHash(),
        expiresAt: verificationCode.expiresAt,
      });

    // @TODO здесь нужно инициировать отправку события типа onRegister
    console.log(registration, verificationCode);

    return registration
      .serialize(function (this: Registration) {
        return {
          id: this.id,
          expiresAt: this.expiresAt,
        };
      });
  }

  public async verify ({ request }: HttpContextContract): Promise<AccessToken> {
    const id = request.input('id') as number;
    const registration = await registrationRepository.getByIdOrFail(id);
    const verificationCode = new VerificationCode({
      code: request.input('verification_code'),
      expiresAt: registration.expiresAt,
    });

    const token = generateAccessToken();

    if (verificationCode.hasExpired())
      throw new Exception('Verification code has expired', 403, 'E_VERIFICATION_CODE_EXPIRED');

    if (!(await registration.verify(verificationCode)))
      throw new Exception('Verification failed', 403, 'E_VERIFICATION_FAILED');

    await registrationRepository.deleteById(registration.id);

    const session = await sessionRepository.add({
      userId: registration.userId,
      accessTokenHash: Session.makeAccessTokenHash(token),
    });

    const accessToken = new AccessToken({
      uuid: session.id.toString(),
      type: AccessTokenType.Bearer,
      token: token,
      expiresAt: null,
    });

    // @TODO здесь нужно инициировать отправку события типа onVerify
    console.log(session, accessToken);
    return accessToken
      .hide(['uuid'])
      .serialize(attributes => ({}));
  }

  public async logout ({ request }: HttpContextContract): Promise<void> {
    const authorizationHeader = request.header('Authorization');

    if (!authorizationHeader) return;

    const accessToken = AccessToken.fromHeaderValue(authorizationHeader);
    const sessionId = Number(accessToken.uuid);

    await sessionRepository.deleteById(sessionId);
  }
}
