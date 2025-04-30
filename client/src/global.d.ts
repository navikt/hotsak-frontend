declare type Maybe<T> = T extends object ? Partial<T> : T | undefined

declare type Nullable<T> = T extends object ? { [P in keyof T]: T[P] | null } : T | null

declare type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>
    }
  : T

declare type DeepNullable<T> = {
  [K in keyof T]: DeepNullable<T[K]> | null
}

declare type Tuple<A, B = A> = [A, B]
