declare module '@ioc:YouRoutine/Repository' {
  import LucidRepository from 'App/Repositories/LucidRepository';
  import Verification from 'App/Models/Verification';

  interface VerificationData {
    id: Verification['id'];
    userId: Verification['userId'];
    code: Verification['code'];
    expiresAt: Verification['expiresAt'];
    createdAt: Verification['createdAt'];
  }

  export const verificationRepo: LucidRepository<typeof Verification, UserData>;
}
