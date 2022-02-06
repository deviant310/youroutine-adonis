type ReadonlyKeys<T> = {[K in keyof T]: T[K]};

type IfEquals<X, Y, A = X, B = never> =
  (<T>() => T extends X ? 1 : 2) extends
    (<T>() => T extends Y ? 1 : 2) ? A : B

type RequiredKeys<T> = { [K in keyof T]-?:
  ({} extends { [P in K]: T[K] } ? never : K)
}[keyof T]

type OptionalKeys<T> = { [K in keyof T]-?:
  ({} extends { [P in K]: T[K] } ? K : never)
}[keyof T]
