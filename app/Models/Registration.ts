import BaseModel from 'App/Models/BaseModel';

export default class Registration extends BaseModel<Registration> {
  public readonly id!: number;
  public userId!: number;
  public verificationCodeHash!: string;
  public expiresAt!: Date | null;
  public readonly updatedAt!: Date;
  public readonly createdAt!: Date;

  public isExpired (): boolean {
    return this.expiresAt ? new Date() > this.expiresAt : false;
  }
}

