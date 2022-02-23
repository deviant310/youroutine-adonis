import { Model, ModelProperties, ModelResponseAttributes } from '@ioc:Adonis/Core/Model';
import { snakeCase } from 'snake-case';
import { pickBy, transform } from 'lodash';

export default abstract class BaseModel<M extends Model> implements Model {
  private visible = Object.getOwnPropertyNames(this) as (keyof ModelProperties<M>)[];

  constructor (data: ModelProperties<M>) {
    const cleanData = pickBy(data, v => v !== undefined);

    Object.assign(this, cleanData);
  }

  public show (keys: (keyof ModelProperties<M>)[]): this {
    debugger;
    this.visible = keys;

    return this;
  }

  public hide (keys: readonly (keyof ModelProperties<M>)[]): this {
    console.log(this.visible);
    keys.forEach(key => {
      this.visible.splice(this.visible.findIndex(item => item === key), 1);
    });
    debugger;
    return this;
  }

  public toJSON (): ModelResponseAttributes<M> {
    type Accumulator = { [key: string]: unknown };

    return transform(Object.getOwnPropertyNames(this), (obj: Accumulator, key) => {
      if(this.visible.includes(key as never))
        obj[snakeCase(key)] = this[key as keyof this];

      return obj;
    }, {}) as ModelResponseAttributes<M>;
  }
}
