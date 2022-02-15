import Session from 'App/Models/Session';
import SQLRepository from './SQLRepository';

export default class SessionRepository extends SQLRepository<Session> {
  public table = 'sessions';
}
