export type DataGridFilterValue = string | number | boolean

export interface DataGridFilter<T extends DataGridFilterValue = DataGridFilterValue> {
  options: ReadonlySet<T> | ReadonlyMap<T, string>
  sortOptions?: boolean
}

export type DataGridFilterOption<T extends DataGridFilterValue = DataGridFilterValue> = [T, string]

export interface DataGridFilterValues<T extends DataGridFilterValue = DataGridFilterValue> {
  values: ReadonlySet<T>
}

export function toDataGridFilterOptions<T extends string>(labels: Record<T, string>, ...values: T[]): Map<T, string> {
  return new Map(
    values.map((value): DataGridFilterOption<T> => {
      const label = labels[value]
      return [value, label]
    })
  )
}

export const emptyDataGridFilterValues: DataGridFilterValues = { values: new Set() }
