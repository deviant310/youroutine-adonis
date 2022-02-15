/*
|--------------------------------------------------------------------------
| Repositories
|--------------------------------------------------------------------------
|
| This file is dedicated for defining default repositories.
| You can change paths for using different repositories. For example:
|
| Define repository in following two files
| ├── Repositories/SQL/SessionRepository.ts
| ├── Repositories/SQL/UserRepository.ts
|
| and then export them here as follows
|
| export { default as UserRepository } from './SQL/UserRepository';
| export { default as SessionRepository } from './Redis/SessionRepository';
|
*/

export { default as UserRepository } from './SQL/UserRepository';
export { default as SessionRepository } from './SQL/SessionRepository';
export { default as RegistrationRepository } from './SQL/RegistrationRepository';
