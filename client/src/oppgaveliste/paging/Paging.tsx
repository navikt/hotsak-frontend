import styled from 'styled-components'

import { Pagination } from '@navikt/ds-react'

import { PageCounter } from './PageCounter'

const Container = styled.div`
  display: flex;
  margin-top: 2rem;
  justify-content: space-between;
`

export const PAGE_SIZE = 25

interface PagingProps {
  totalElements: number
  currentPage: number
  onPageChange(...args: any[]): any
}

export function Paging({ totalElements, currentPage, onPageChange }: PagingProps) {
  const totalNumberOfPages = Math.ceil(totalElements / PAGE_SIZE)
  const hasMultiplePages = totalNumberOfPages > 1

  return (
    <>
      <Container>
        {hasMultiplePages && (
          <Pagination
            count={totalNumberOfPages}
            page={currentPage}
            prevNextTexts={true}
            size="small"
            onPageChange={(page: number) => onPageChange(page)}
          />
        )}
      </Container>
      <PageCounter pageSize={PAGE_SIZE} currentPage={currentPage} totalElements={totalElements} />
    </>
  )
}
