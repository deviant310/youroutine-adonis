import { Model, ModelProperties, ModelResponseAttributes } from '@ioc:Adonis/Core/Model';
import { snakeCase } from 'snake-case';

export default abstract class BaseModel<M extends Model> implements Model {
  constructor (data: ModelProperties<M>) {
    const cleanData = Object.entries(data)
      .reduce((obj: { [key: string]: unknown }, [key, value]) => {
        if (value !== undefined)
          obj[key] = value;
        return obj;
      }, {});

    Object.assign(this, cleanData);
  }

  public toJSON (): ModelResponseAttributes<M> {
    return Object.getOwnPropertyNames(this)
      .reduce((obj: { [key: string]: unknown }, key) => {
        Object.defineProperty(obj, snakeCase(key), {
          value: this[key as keyof this],
        });

        return obj;
      }, {}) as ModelResponseAttributes<M>;
  }
}
