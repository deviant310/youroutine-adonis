import {
  Attributes,
  DirtyAttributes,
  Model,
  Properties,
  SerializedAttributes,
} from '@ioc:Adonis/Core/Model';
import { snakeCase } from 'snake-case';
import { pickBy, transform } from 'lodash';

class BaseModel implements Model {
  //private visible = Object.getOwnPropertyNames(this) as (keyof Properties<this>)[];

  constructor (public $attributes: Attributes<Model>) {
    //const dirtyAttributes = pickBy(attributes, v => v !== undefined) as DirtyAttributes<this>;

    return new Proxy(this, {
      get: (obj: this, key: string) => {
        const value = obj[key as keyof typeof obj];

        return value !== undefined ? value : obj.$attributes[key as keyof typeof obj.$attributes];
      },
    });
  }

  /*public serialize (callback?: () => ModelResponseAttributes<M>){
    if(typeof callback === 'function')
      callback.bind(this);
  }

  public show (keys: (keyof ModelProperties<M>)[]): this {
    this.visible = keys;

    return this;
  }

  public hide (keys: readonly (keyof ModelProperties<M>)[]): this {
    console.log(this.visible);
    keys.forEach(key => {
      this.visible.splice(this.visible.findIndex(item => item === key), 1);
    });

    return this;
  }*/

  public serialize (): SerializedAttributes<this> {
    type Accumulator = { [key: string]: unknown };

    return transform(this.$attributes, (obj: Accumulator, value, key) => {
      obj[snakeCase(key)] = value;

      return obj;
    }, {}) as SerializedAttributes<this>;
  }
}

export default BaseModel;
