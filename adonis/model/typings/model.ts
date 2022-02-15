declare module '@ioc:Adonis/Core/Model' {
  export type Model = {
    toJSON (): { [key: string]: ModelDataValues };
  };

  export type ModelData<Data> = Pick<Data, {
    [K in keyof Data]: Data[K] extends Function ? never : Data[K] extends ModelDataValues ? K : never;
  }[keyof Data]>;

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
