export type Predicate<T> = (item: T) => boolean

export function and<T>(...predicates: Predicate<T>[]): Predicate<T> {
  return (item: T) => predicates.every((it) => it(item))
}
