/*
|--------------------------------------------------------------------------
| Http Exception Handler
|--------------------------------------------------------------------------
|
| AdonisJs will forward all exceptions occurred during an HTTP request to
| the following class. You can learn more about exception handling by
| reading docs.
|
| The exception handler extends a base `HttpExceptionHandler` which is not
| mandatory, however it can do a lot of heavy lifting to handle the errors
| properly.
|
*/

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler';
import Logger from '@ioc:Adonis/Core/Logger';

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor () {
    super(Logger);
  }

  public async handle (error: any, ctx: HttpContextContract): Promise<void> {
    console.log(error);
    return ctx.response
      .status(error.status || 500)
      .send({
        message: error.message,
        stack: error.stack.split('\n'),
        code: error.code,
      });
  }
}
