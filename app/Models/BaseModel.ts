import { IModelDataValues } from '@ioc:Adonis/Core/Model';
import { snakeCase } from 'snake-case';

export default abstract class BaseModel {
  public toJSON<T extends BaseModel> (this: T): { [key: string]: IModelDataValues } {
    return Object.getOwnPropertyNames(this)
      .reduce((obj: { [key: string]: IModelDataValues }, key) => {
        Object.defineProperty(this, snakeCase(key), {
          value: this[key as keyof T],
        });

        return obj;
      }, {});
  }
}

