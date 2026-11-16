import { ChevronLeftIcon, ChevronRightIcon } from '@navikt/aksel-icons'
import { Box, Button, HStack, Pagination, VStack, type ButtonProps } from '@navikt/ds-react'

import { calculateTotalPages, type PageRequest } from './Page.ts'
import classes from './Paginering.module.css'
import { Tekst } from './typografi.tsx'

export interface PagineringProps extends PageRequest {
  totalElements: number
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

export interface CursorPagineringProp extends PageRequest {
  onPageChange?(pageNumber: number): void
}

export function CursorPaginering(props: CursorPagineringProp) {
  const { pageNumber, onPageChange } = props
  const buttonsProps: ButtonProps = {
    size: 'xsmall',
    type: 'button',
    variant: 'secondary',
    'data-color': 'neutral',
  }
  const createPageHandler = (offset: number) => (onPageChange ? () => onPageChange(pageNumber + offset) : undefined)
  const handleClickForrige = createPageHandler(-1)
  const handleClickNeste = createPageHandler(1)
  return (
    <HStack as="ul" align="center" gap="space-12" className={classes.cursorPaginering}>
      <Button
        {...buttonsProps}
        onClick={handleClickForrige}
        disabled={pageNumber === 1}
        icon={<ChevronLeftIcon />}
        iconPosition="left"
      >
        Forrige
      </Button>
      <Box as="li">Side {pageNumber}</Box>
      <Button {...buttonsProps} onClick={handleClickNeste} icon={<ChevronRightIcon />} iconPosition="right">
        Neste
      </Button>
    </HStack>
  )
}
