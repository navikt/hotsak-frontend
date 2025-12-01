export type PropertySelector<T, K extends keyof T> = (item: T) => T[K]
export type ValueSelector<T, R> = (item: T) => R
export type Selector<T, K extends keyof T, R> = PropertySelector<T, K> | ValueSelector<T, R>

export function select<T, K extends keyof T>(selector: K): PropertySelector<T, K>
export function select<T, R>(selector: (item: T) => R): ValueSelector<T, R>
export function select<T, K extends keyof T, R>(selector: K | ((item: T) => R)): Selector<T, K, R> {
  return typeof selector === 'function' ? selector : (item: T) => item[selector]
}
