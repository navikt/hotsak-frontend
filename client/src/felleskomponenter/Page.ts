export interface PageRequest {
  pageNumber: number
  pageSize: number
}

export interface PageResponse extends PageRequest {
  totalElements: number
}

export function calculateOffset<T extends PageRequest = PageRequest>({ pageNumber, pageSize }: T) {
  return (pageNumber - 1) * pageSize
}

export function calculateTotalPages<T extends PageResponse = PageResponse>({ pageSize, totalElements }: T) {
  return Math.ceil(totalElements / pageSize)
}
