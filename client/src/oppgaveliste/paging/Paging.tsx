import styled from 'styled-components/macro'
import { Pagination } from '@navikt/ds-react'
import { PageCounter } from './PageCounter'
import { generatePageNumbers } from './pageNumbers'

const Container = styled.div`
  display: flex;
  margin-top: 1rem;
  justify-content: space-between;
`

export const PAGE_SIZE = 25
const visiblePages = 10

interface PaginationProps {
  totalCount: number
  currentPage: number
  onPageChange: Function
}

export const Paging: React.FC<PaginationProps> = ({ totalCount, currentPage, onPageChange }) => {
  const totalNumberOfPages = Math.ceil(totalCount / PAGE_SIZE)
  const pages = generatePageNumbers(currentPage, totalNumberOfPages, visiblePages)
  const hasMultiplePages = pages.length > 1

  
  return (
    <>
      <Container>
        {hasMultiplePages && (
          <Pagination count={totalNumberOfPages} page={currentPage} onPageChange={(page: number) => onPageChange(page)} />
        )}
      </Container>
      <PageCounter pageSize={PAGE_SIZE} currentPage={currentPage + 1} totalCount={totalCount} />
    </>
  )
}
