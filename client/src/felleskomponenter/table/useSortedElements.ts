import { useEffect, useState } from 'react'

import { Column } from './Column'

type SortDirection = 'ascending' | 'descending'

export interface Sort<T> {
  orderBy: keyof T
  direction: SortDirection
}

export function useSortedElements<T>(elements: T[], columns: Column<T>[], initialSort: Sort<T>) {
  const [sort, setSort] = useState<Sort<T>>(initialSort)
  const [sortedElements, setSortedElements] = useState(elements)

  useEffect(() => {
    const { orderBy, direction } = sort
    const accessor = columns.find(({ key }) => key === orderBy)?.accessor
    const e = elements.slice().sort((a, b) => {
      if (accessor) {
        return accessor(a).localeCompare(accessor(b))
      } else {
        return `${a[orderBy]}`.localeCompare(`${b[orderBy]}`)
      }
    })
    if (direction === 'ascending') {
      setSortedElements(e)
    } else {
      setSortedElements(e.reverse())
    }
  }, [elements, sort])

  return {
    sort,
    sortedElements,
    onSortChange(sortKey?: string) {
      setSort({
        orderBy: (sortKey as any) || initialSort.orderBy,
        direction: sort.direction === 'ascending' ? 'descending' : 'ascending',
      })
    },
  }
}
