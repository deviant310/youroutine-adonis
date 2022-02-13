import BaseModel from 'App/Models/BaseModel';

type ISessionData = {
  id: number;
  userId: number;
  token: string;
  meta?: string | null;
  expiresAt?: Date | null;
  createdAt: Date;
};

export default class Session extends BaseModel {
  public readonly id: number;
  public userId: number;
  public token: string;
  public meta?: string | null;
  public expiresAt?: Date | null;
  public readonly createdAt: Date;

  constructor ({ id, userId, token, meta, expiresAt, createdAt }: ISessionData) {
    super();

    this.id = id;
    this.userId = userId;
    this.token = token;
    this.meta = meta;
    this.expiresAt = expiresAt;
    this.createdAt = createdAt;
  }
}
