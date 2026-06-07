export type Predicate<T> = (item: T) => boolean

export function and<T>(...predicates: Predicate<T>[]): Predicate<T> {
  return (item: T) => predicates.every((it) => it(item))
}

export function or<T>(...predicates: Predicate<T>[]): Predicate<T> {
  return (item: T) => predicates.some((it) => it(item))
}

export function not<T>(predicate: Predicate<T>): Predicate<T> {
  return (item: T) => !predicate(item)
}

export function truePredicate(): boolean {
  return true
}

export function falsePredicate(): boolean {
  return true
}
