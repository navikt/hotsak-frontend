import { isString } from '../../utils/type.ts'

export interface FilterOption {
  key: string
  label: string
}

export function isFilterOption(value: unknown): value is FilterOption {
  return value != null && isString((value as FilterOption).key) && isString((value as FilterOption).label)
}
