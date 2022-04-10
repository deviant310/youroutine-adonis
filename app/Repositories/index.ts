/*
|--------------------------------------------------------------------------
| Repositories
|--------------------------------------------------------------------------
|
| This file is dedicated for defining default repositories.
| You can change paths for using different repositories. For example:
|
| Define repository in following two files
| ├── Repositories/SessionRedisRepository.ts
| ├── Repositories/UserSQLRepository.ts
|
| and then export them here as follows
|
| export { default as UserRepository } from './UserSQLRepository';
| export { default as SessionRepository } from './SessionRedisRepository';
|
*/

export { default as UserRepository } from './UserSQLRepository';
export { default as SessionRepository } from './SessionSQLRepository';
export { default as RegistrationRepository } from './RegistrationSQLRepository';
