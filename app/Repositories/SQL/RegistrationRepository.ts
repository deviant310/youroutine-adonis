import Registration from 'App/Models/Registration';
import SQLRepository from './SQLRepository';

export default class RegistrationRepository extends SQLRepository<Registration> {
  public table = 'registrations';
}
