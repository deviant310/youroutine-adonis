import Session from 'App/Models/Session';

import SQLRepository from './SQLRepository';

export default class SessionRepository extends SQLRepository<Session> {
  public table = 'sessions';

  /*constructor () {
    super();

    this.token = string.generateRandom(SessionRepository._tokenLength);
  }*/

  /*public static async beforeCreate (session: SessionRepository): Promise<void> {
    if (session.dirty.token)
      session.token = createHash('sha256').update(session.dirty.token).digest('hex');
  }*/
}
