import BaseModel from 'App/Models/BaseModel';

export default class Token extends BaseModel<Token> {
  public readonly value!: string;
}
