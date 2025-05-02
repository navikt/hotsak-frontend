declare type Maybe<T> = T | undefined

declare type Nullable<T> = T | null

declare type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>
    }
  : T

declare type DeepNullable<T> = {
  [K in keyof T]: DeepNullable<T[K]> | null
}

declare type Tuple<A, B = A> = [A, B]
declare type Triple<A, B = A, C = A> = [A, B, C]
