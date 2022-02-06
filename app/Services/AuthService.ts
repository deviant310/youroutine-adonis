import { createHash } from 'crypto';
import faker from 'faker';
import { Exception } from '@adonisjs/core/build/standalone';
import Hash from '@ioc:Adonis/Core/Hash';
import { base64, string } from '@ioc:Adonis/Core/Helpers';
import User from 'App/Models/User';
import Session from 'App/Models/Session';
import RegisteredSession from './Auth/RegisteredSession';
import VerifiedSession from './Auth/VerifiedSession';
//import type LucidRepository from 'App/Repositories/LucidRepository'
import { RepositoryContract } from '@ioc:Adonis/Core/Repository';
import { inject } from '@adonisjs/fold';
import UserRepository from 'App/Repositories/UserRepository'
import sessionRepo, { Data as SessionData } from '@ioc:YouRoutine/Repository/Session';
import verificationRepo, { Data as VerificationData } from '@ioc:YouRoutine/Repository/Verification';
import { DateTime } from 'luxon';

export default class AuthService {
  private _sessionId?: string | number;
  private readonly _accessTokenConvertIterationsCount = 2;
  private readonly _authTokenLength = 60;

  public async session (): Promise<SessionData | null> {
    return this._sessionId ? sessionRepo.findById(this._sessionId) : null;
  }

  public async user (): Promise<UserData | null> {
    const session = await this.session();

    return session ? userRepo.findById(session.userId) : null;
  }

  public async createUserVerificationByPhone (phone: string): Promise<VerificationData> {
    const user = await userRepo.findByOrFail('phone', phone);
    const verificationCode = faker.datatype.number({ min: 100000, max: 999999 }).toString();
    const verification = await verificationRepo
      .create({
        userId: user.id,
        code: verificationCode,
      });

    // @TODO здесь нужно инициировать отправку события типа onRegister
    console.log(verification);

    return verification;
  }

  public async createUserSessionByVerification (verificationId: number, verificationCode: string): Promise<SessionData> {
    const verification = await verificationRepo.findByIdOrFail(verificationId);

    if (verification.expiresAt && new DateTime() > verification.expiresAt)
      throw new Exception('Verification code has expired', 403, 'E_VERIFICATION_CODE_EXPIRED');

    const codeIsVerified = await Hash.verify(verification.code, verificationCode);

    if (!codeIsVerified)
      throw new Exception('Verification failed', 403, 'E_VERIFICATION_FAILED');

    await verificationRepo.deleteById(verification.id);

    const session = await sessionRepo.create({
      userId: verification.userId,
      accessToken: string.generateRandom(this._authTokenLength),
    });

    this._sessionId = session.id;

    // @TODO здесь нужно инициировать отправку события типа onVerify
    console.log(session);

    return session;
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
    const sessionIdEncoded = [...Array(this._accessTokenConvertIterationsCount).keys()]
      .reduce(str => base64.encode(str), sessionId.toString());

    return [sessionIdEncoded, rawAccessToken].join('.');
  }

  private parsePublicAccessToken (publicAccessToken: string): [number, string] {
    const [sessionIdEncoded, accessToken] = publicAccessToken.split('.');
    const sessionId = parseInt([...Array(this._accessTokenConvertIterationsCount).keys()]
      .reduce(str => base64.decode(str), sessionIdEncoded));

    return [sessionId, accessToken];
  }
}
