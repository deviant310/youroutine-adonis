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
    const code = generateVerificationCode();

    const user = await userRepository
      .getFirstOfListOrFail({
        select: ['id'] as const,
        where: { phone },
      });

    const registration = await registrationRepository
      .add({
        userId: user.id,
        verificationCode: await Registration
          .makeVerificationCodeHash(code),
        expiresAt: DateTime.now().plus({ minutes: 5 }),
      });

    const verificationCode = new VerificationCode({
      code: code,
      expiresAt: registration.expiresAt,
    });

    // @TODO здесь нужно инициировать отправку события типа onRegister
    console.log(registration, verificationCode);

    return registration.show(['id', 'expiresAt']);
  }

  public async verify ({ request }: HttpContextContract): Promise<AccessToken> {
    const id = request.input('id') as number;
    const code = request.input('verification_code') as string;
    const token = generateAccessToken();

    const registration = await registrationRepository
      .getByIdOrFail(id);

    const verificationCode = new VerificationCode({
      code: code,
      expiresAt: registration.expiresAt,
    });

    if (verificationCode.hasExpired())
      throw new Exception('Verification code has expired', 403, 'E_VERIFICATION_CODE_EXPIRED');

    if (!(await registration.verifyCode(code)))
      throw new Exception('Verification failed', 403, 'E_VERIFICATION_FAILED');

    await registrationRepository.deleteById(registration.id);

    const session = await sessionRepository.add({
      userId: registration.userId,
      accessToken: Session
        .makeAccessTokenHash(token),
    });

    const accessToken = new AccessToken({
      uuid: session.id.toString(),
      type: AccessTokenType.Bearer,
      token: token,
      expiresAt: null,
    });

    // @TODO здесь нужно инициировать отправку события типа onVerify
    console.log(session, accessToken);
    debugger;
    return accessToken.hide(['uuid']);
  }

  public async logout ({ request }: HttpContextContract): Promise<void> {
    const authorizationHeader = request.header('Authorization');

    if(!authorizationHeader) return;

    const accessToken = AccessToken.fromHeaderValue(authorizationHeader);
    const sessionId = Number(accessToken.uuid);

    await sessionRepository.deleteById(sessionId);
  }
}
