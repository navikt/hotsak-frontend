import { type DataGridFilterValues } from './DataGridFilter.ts'

export class DataGridCollection<T extends object> {
  private readonly items: ReadonlyArray<T>

  constructor(items: ReadonlyArray<T>) {
    this.items = items
  }

  filterBy<R extends string>(selector: (item: T) => R, filter?: DataGridFilterValues<R>): DataGridCollection<T> {
    if (filter == null || filter.values == null || !filter.values.size) return this
    return new DataGridCollection(this.items.filter((item) => filter.values.has(selector(item))))
  }

  toSorted(comparator?: (a: T, b: T) => number): DataGridCollection<T> {
    if (!comparator) return this
    return new DataGridCollection(this.items.toSorted(comparator))
  }

  toArray(): ReadonlyArray<T> {
    return this.items
  }

  static from<T extends object>(items: ReadonlyArray<T> | null | undefined): DataGridCollection<T> {
    return new DataGridCollection(items ?? [])
  }
}
