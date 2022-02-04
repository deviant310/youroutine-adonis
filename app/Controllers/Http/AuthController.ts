import { inject } from '@adonisjs/fold';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { string } from '@ioc:Adonis/Core/Helpers'
import { Data as SessionData } from '@ioc:YouRoutine/Repository/Session'
import RegistrationData from 'App/Repositories/Registration/RegistrationData'

export default class AuthController {
  constructor (auth) {
  }

  public async login ({ twoFactorAuth, request }: HttpContextContract) {
    const email = request.input('email');
    const password = request.input('password');

    return await auth.use('api').attempt(email, password, {
      expiresIn: '1mins',
    });
  }

  public async register ({ auth, request }: HttpContextContract) {
    const phone = request.input('phone');

    return auth.register(phone);
  }

  public async verify ({ auth, request }: HttpContextContract) {
    const sessionId = request.input('session_id');
    const verificationCode = request.input('verification_code');

    return auth.verify(sessionId, verificationCode);
  }

  public async logout ({ auth }: HttpContextContract) {
    await auth.logout();
  }

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

  public async registerUserByPhone (phone: string): Promise<RegistrationData> {
    const user = await userRepo.findByOrFail('phone', phone);
    const verificationCode = faker.datatype.number({ min: 100000, max: 999999 }).toString();
    const registration = await registrationRepo
      .create({
        userId: user.id,
        code: verificationCode,
      });

    // @TODO здесь нужно инициировать отправку события типа onRegister
    console.log(registration);

    return registration;
  }

  public async verifyUserByRegistrationId (id: number, verificationCode: string): Promise<SessionData> {
    const registration = await registrationRepo.findByIdOrFail(id);

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
