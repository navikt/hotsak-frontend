import React from 'react'
import styled from 'styled-components'

import { Pagination } from '@navikt/ds-react'

import { PageCounter } from './PageCounter'

const Container = styled.div`
  display: flex;
  margin-top: 2rem;
  justify-content: space-between;
`

export const PAGE_SIZE = 25

interface PaginationProps {
  totalCount: number
  currentPage: number
  onPageChange: (...args: any[]) => any
}

export const Paging: React.FC<PaginationProps> = ({ totalCount, currentPage, onPageChange }) => {
  const totalNumberOfPages = Math.ceil(totalCount / PAGE_SIZE)
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
      <PageCounter pageSize={PAGE_SIZE} currentPage={currentPage} totalCount={totalCount} />
    </>
  )
}
