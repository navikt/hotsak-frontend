import React from 'react'
import styled from 'styled-components/macro'

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
  onPageChange: Function
}

export const Paging: React.VFC<PaginationProps> = ({ totalCount, currentPage, onPageChange }) => {
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
