import type { ReactElement } from 'react'

export interface Column<T> {
  key: keyof T
  name?: string
  width?: number
  sortable?: boolean

  render(verdi: T): ReactElement | null
  accessor?(value: T): string
}
