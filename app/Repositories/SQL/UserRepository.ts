import User from 'App/Models/User';
import SQLRepository from './SQLRepository';

export default class UserRepository extends SQLRepository<User> {
  public table = 'users';
}
