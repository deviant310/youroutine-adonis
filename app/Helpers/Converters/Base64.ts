import { base64 } from '@ioc:Adonis/Core/Helpers';

export default class Base64 {
  public static encode (string: string, iterations: number = 1) {
    if (iterations < 1)
      throw new Error('Iterations value must be natural number value');

    return [...Array(iterations).keys()]
      .reduce(str => base64.encode(str), string);
  }

  public static decode (string: string, iterations: number = 1) {
    if (iterations < 1)
      throw new Error('Iterations value must be natural number value');

    return [...Array(iterations).keys()]
      .reduce(str => base64.decode(str), string);
  }
}
