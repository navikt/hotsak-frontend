import styled from '@emotion/styled'
import { Button } from '@navikt/ds-react'
import { PageCounter } from './PageCounter'

const Container = styled.div`
  display: flex;
  margin-top: 1rem;
  justify-content: space-between;
`

const ButtonsNumbersContainer = styled.div`
  margin: 0.5rem;

  > button:not(:last-of-type) {
    margin-right: 0.5rem;
  }
`
export const PAGE_SIZE = 25

interface PaginationProps {
  totalCount: number
  currentPage: number
  onChangePage: Function
}

const pageNumbers = (totalCount: number) => {
  const totalPages = Math.ceil(totalCount / PAGE_SIZE)
  return Array(totalPages)
    .fill(0)
    .map((_, idx) => idx + 1)
}

export const Pagination: React.FC<PaginationProps> = ({ totalCount, currentPage, onChangePage }) => {
  
  const pages = pageNumbers(totalCount)
  const hasMultiplePages = pages.length > 1
  return (
    <Container>
      {hasMultiplePages && <ButtonsNumbersContainer>
          <Button
            size="small"
            variant="tertiary"
            disabled={currentPage === 1}
            onClick={() => onChangePage(currentPage - 1)}
          >
            Forrige
          </Button>
        {pages.map((page) => {
          return (
            <Button
              key={page}
              size="small"
              variant={page === currentPage ? 'primary' : 'tertiary'}
              onClick={() => onChangePage(page)}
            >
              {page}
            </Button>
        )})}
        
          <Button
            size="small"
            variant="tertiary"
            disabled={currentPage === pages.length}
            onClick={() => onChangePage(currentPage + 1)}
          >
            Neste
          </Button>
      </ButtonsNumbersContainer>}

      <PageCounter pageSize={PAGE_SIZE} currentPage={currentPage} totalCount={totalCount} />
    </Container>
  )
}
