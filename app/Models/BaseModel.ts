import { Model, ModelProperties, ModelDataValues } from '@ioc:Adonis/Core/Model';
import { snakeCase } from 'snake-case';

export default abstract class BaseModel<ModelInstance extends BaseModel<ModelInstance>> implements Model {
  constructor (data: ModelProperties<ModelInstance>) {
    const cleanData = Object.entries(data)
      .reduce((obj: { [key: string]: unknown }, [key, value]) => {
        if(value !== undefined)
          obj[key] = value;
        return obj;
      }, {});

    Object.assign(this, cleanData);
  }

  public toJSON<T extends BaseModel<ModelInstance>> (this: T): { [key: string]: ModelDataValues } {
    return Object.getOwnPropertyNames(this)
      .reduce((obj: { [key: string]: ModelDataValues }, key) => {
        Object.defineProperty(this, snakeCase(key), {
          value: this[key as keyof T],
        });

        return obj;
      }, {});
  }
}
