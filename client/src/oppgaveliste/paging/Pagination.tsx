import styled from 'styled-components/macro'
import { Button } from '@navikt/ds-react'
import { PageCounter } from './PageCounter'
import { generatePageNumbers } from './pageNumbers'

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
const visiblePages = 10

interface PaginationProps {
  totalCount: number
  currentPage: number
  onChangePage: Function
}


export const Pagination: React.FC<PaginationProps> = ({ totalCount, currentPage, onChangePage }) => {
const totalNumberOfPages = Math.ceil(totalCount / PAGE_SIZE)
  const pages = generatePageNumbers(currentPage, totalNumberOfPages, visiblePages)
  const hasMultiplePages = pages.length > 1
  return (
    <>
      <Container>
        {hasMultiplePages && (
          <ButtonsNumbersContainer>
            <Button
              size="small"
              variant="tertiary"
              disabled={currentPage === 1}
              onClick={() => onChangePage(currentPage - 1)}
            >
              Forrige
            </Button>
            {pages.map((page) => {
              return page === '...' ? (
                <Button key={page} size="small" variant="tertiary">
                  {page}
                </Button>
              ) : (
                <Button
                  key={page}
                  size="small"
                  variant={page === currentPage ? 'primary' : 'tertiary'}
                  onClick={() => onChangePage(page)}
                >
                  {page}
                </Button>
              )
            })}

            <Button
              size="small"
              variant="tertiary"
              disabled={currentPage === totalNumberOfPages}
              onClick={() => onChangePage(currentPage + 1)}
            >
              Neste
            </Button>
          </ButtonsNumbersContainer>
        )}
      </Container>
      <PageCounter pageSize={PAGE_SIZE} currentPage={currentPage} totalCount={totalCount} />
    </>
  )
}
