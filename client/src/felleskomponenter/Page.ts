import { useSearchParams } from 'react-router'

export interface PageRequest {
  pageNumber: number
  pageSize: number
}

export interface Pageable extends PageRequest {
  totalPages: number
  totalElements: number
  isFirst: boolean
  isLast: boolean
  hasPrevious: boolean
  hasNext: boolean
}

export function calculateOffset<T extends PageRequest = PageRequest>({ pageNumber, pageSize }: T) {
  return (pageNumber - 1) * pageSize
}

export function calculateTotalPages<
  T extends PageRequest & { totalElements: number } = PageRequest & { totalElements: number },
>({ pageSize, totalElements }: T) {
  return Math.ceil(totalElements / pageSize)
}

const DEFAULT_PAGE_SIZE = 20

function toPositiveInt(value: string | null, fallback: number): number {
  const n = Number(value)
  return Number.isInteger(n) && n >= 1 ? n : fallback
}

export function usePageRequest(
  defaultPageSize: number = DEFAULT_PAGE_SIZE,
  pageNumberName = 'page',
  pageSizeName = 'size'
) {
  const [searchParams, setSearchParams] = useSearchParams()

  const pageRequest: PageRequest = {
    pageNumber: toPositiveInt(searchParams.get(pageNumberName), 1),
    pageSize: toPositiveInt(searchParams.get(pageSizeName), defaultPageSize),
  }

  const setPageRequest = (next: Partial<PageRequest>) => {
    setSearchParams((params) => {
      if (next.pageNumber !== undefined) params.set(pageNumberName, String(next.pageNumber))
      if (next.pageSize !== undefined) params.set(pageSizeName, String(next.pageSize))
      return params
    })
  }

  return [pageRequest, setPageRequest] as const
}
