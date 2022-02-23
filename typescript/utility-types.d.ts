type Readable<A, T = Required<A>> = {
  [K in keyof T]: (<Q>() => Q extends { readonly [X in K]: T[K] } ? 0 : 1) extends (<Q>() => Q extends { [X in K]: T[K] } ? 0 : 1) ? T[K] : never;
};

type ReadableKeys<T, R = Readable<T>> = {[K in keyof R]: R[K] extends never ? never : K}[keyof R];

type PickReadable<T> = Pick<T, ReadableKeys<T>>;

type OmitReadable<T> = Omit<T, ReadableKeys<T>>;
