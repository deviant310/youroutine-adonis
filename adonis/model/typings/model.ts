declare module '@ioc:Adonis/Core/Model' {
  export type Model = {
    toJSON (): { [key: string]: ModelDataValues };
  };

  export type ModelProperties<ModelInstance> = Pick<ModelInstance, {
    [K in keyof ModelInstance]: ModelInstance[K] extends Function ? never : ModelInstance[K] extends ModelDataValues ? K : never;
  }[keyof ModelInstance]>;

  export type ModelDataValues =
    string
    | number
    | boolean
    | Date
    | string[]
    | number[]
    | Date[]
    | boolean[]
    | Buffer
    | null
    | undefined;
}
