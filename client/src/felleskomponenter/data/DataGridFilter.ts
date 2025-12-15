export interface DataGridFilter<T extends string = string> {
  options: ReadonlySet<T> | ReadonlyMap<T, string>
}

export interface DataGridFilterValues<T extends string = string> {
  values: ReadonlySet<T>
}

export function toDataGridFilterOptions<T extends string>(labels: Record<T, string>, ...values: T[]): Map<T, string> {
  return new Map(
    values.map((value) => {
      const label = labels[value]
      return [value, label]
    })
  )
}

export const emptyDataGridFilterValues: DataGridFilterValues = { values: new Set() }
