type ReadableKeys<T> = {
  [K in keyof T]: (<Q>() => Q extends { readonly [X in K]: T[K] } ? 0 : 1) extends (<Q>() => Q extends { [X in K]: T[K] } ? 0 : 1) ? K : never;
}[keyof T];

type PickReadable<T> = Pick<T, ReadableKeys<T>>;

type OmitReadable<T> = Omit<T, ReadableKeys<T>>;
