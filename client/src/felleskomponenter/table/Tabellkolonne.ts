import type { ReactNode } from 'react'

export interface Tabellkolonne<T> {
  key: keyof T | string
  name?: string
  width?: number
  sortable?: boolean
  hide?: boolean

  header?(): ReactNode
  render(verdi: T): ReactNode
  accessor?(verdi: T): string
}
