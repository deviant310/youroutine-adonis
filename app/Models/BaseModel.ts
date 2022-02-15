import { Model, ModelData, ModelDataValues } from '@ioc:Adonis/Core/Model';
import { snakeCase } from 'snake-case';

export default abstract class BaseModel<Data extends BaseModel<Data>> implements Model {
  constructor (data: ModelData<Data>) {
    Object.assign(this, data);
  }

  public toJSON<T extends BaseModel<Data>> (this: T): { [key: string]: ModelDataValues } {
    return Object.getOwnPropertyNames(this)
      .reduce((obj: { [key: string]: ModelDataValues }, key) => {
        Object.defineProperty(this, snakeCase(key), {
          value: this[key as keyof T],
        });

        return obj;
      }, {});
  }
}
