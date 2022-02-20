import { string } from '@ioc:Adonis/Core/Helpers';
import faker from 'faker';

export function generateAccessToken (): string {
  return string.generateRandom(60);
}

export function generateVerificationCode (): string {
  return faker
    .datatype
    .number({ min: 100000, max: 999999 })
    .toString();
}
