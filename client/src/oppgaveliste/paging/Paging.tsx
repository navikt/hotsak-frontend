import { Pagination, VStack } from '@navikt/ds-react'

import { PageCounter } from './PageCounter'

export const PAGE_SIZE = 50

interface PagingProps {
  totalElements: number
  currentPage: number
  onPageChange(...args: any[]): any
}

export function Paging({ totalElements, currentPage, onPageChange }: PagingProps) {
  const totalNumberOfPages = Math.ceil(totalElements / PAGE_SIZE)
  const hasMultiplePages = totalNumberOfPages > 1

  return (
    <VStack gap="2" marginBlock="6 0">
      {hasMultiplePages && (
        <Pagination
          count={totalNumberOfPages}
          page={currentPage}
          prevNextTexts={true}
          size="small"
          onPageChange={(page: number) => onPageChange(page)}
        />
      )}
      <PageCounter pageSize={PAGE_SIZE} currentPage={currentPage} totalElements={totalElements} />
    </VStack>
  )
}
