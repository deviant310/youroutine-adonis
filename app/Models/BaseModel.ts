import { Model, ModelProperties, ModelResponseAttributes } from '@ioc:Adonis/Core/Model';
import { snakeCase } from 'snake-case';
import { pickBy, transform } from 'lodash';

export default abstract class BaseModel<M extends Model> implements Model {
  constructor (data: ModelProperties<M>) {
    const cleanData = pickBy(data, v => v !== undefined);

    Object.assign(this, cleanData);
  }

  public toJSON (): ModelResponseAttributes<M> {
    type Accumulator = { [key: string]: unknown };

    return transform(Object.getOwnPropertyNames(this), (obj: Accumulator, key) => {
      obj[snakeCase(key)] = this[key as keyof this];

      return obj;
    }, {}) as ModelResponseAttributes<M>;
  }
}
