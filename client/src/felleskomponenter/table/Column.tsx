import type { ReactElement } from 'react'

export interface Column<T> {
  //key: keyof T
  key: string
  name?: string
  width?: number
  sortable?: boolean

  render(verdi: T): ReactElement | null
  accessor?(verdi: T): string
}
