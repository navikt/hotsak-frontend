import { Pagination, VStack } from '@navikt/ds-react'

import { PageResponse, calculateTotalPages } from './Page.ts'
import { Tekst } from './typografi.tsx'

export interface PagineringProps extends PageResponse {
  tekst: string
  onPageChange(pageNumber: number): void
}

export function Paginering(props: PagineringProps) {
  const { pageNumber, pageSize, totalElements, tekst, onPageChange } = props
  const totalPages = calculateTotalPages(props)
  const first = pageSize * (pageNumber - 1) + 1
  const last = first + pageSize - 1
  return (
    <VStack gap="space-12" marginBlock="space-12 space-0">
      {totalPages > 1 && (
        <Pagination page={pageNumber} count={totalPages} size="small" onPageChange={onPageChange} prevNextTexts />
      )}
      <Tekst>{`Viser ${first} - ${last > totalElements ? totalElements : last} av ${totalElements} ${tekst}`}</Tekst>
    </VStack>
  )
}
