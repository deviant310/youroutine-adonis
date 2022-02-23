import { Exception } from '@adonisjs/core/build/standalone';
import Application from '@ioc:Adonis/Core/Application';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Repositories from '@ioc:YouRoutine/Repositories';
import AccessToken from 'App/Models/AccessToken';

const { sessionRepository } = Repositories;

export default class AuthMiddleware {
  public async handle (ctx: HttpContextContract, next: () => Promise<void>): Promise<void> {
    try {
      await this.authenticate(ctx, next);
    } catch (err) {
      if (Application.inProduction)
        throw new Exception('Unauthorized access', 403, 'E_UNAUTHORIZED_ACCESS');
      else
        throw err;
    }
  }

  protected async authenticate ({ request }: HttpContextContract, next: () => Promise<void>): Promise<void> {
    const authorizationHeader = request.header('Authorization');

    if (!authorizationHeader)
      throw new Exception('Authorization header is empty', 403, 'E_EMPTY_AUTHORIZATION_HEADER');

    const accessToken = AccessToken.fromHeaderValue(authorizationHeader);
    const sessionId = Number(accessToken.uuid);

    const session = await sessionRepository.getByIdOrFail(sessionId);

    if(!session.verifyAccessToken(accessToken.token))
      throw new Exception('Invalid access token', 403, 'E_INVALID_ACCESS_TOKEN');

    await next();
  }
}
