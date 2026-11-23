import { Box, Detail, HGrid } from '@navikt/ds-react'
import { type Pageable } from '../Page'
import classes from './DataGridToolbar.module.css'

export interface DataGridToolbarProps extends Partial<Pageable> {
  elements?: number
  elementsName: string
  isLoading?: boolean
}

export function DataGridToolbar(props: DataGridToolbarProps) {
  const { elements = 0, elementsName, totalElements = 0, isLoading } = props
  return (
    <Box borderColor="neutral-subtleA" borderWidth="0 0 2 0" padding="space-8">
      <HGrid columns="1fr 1fr" align="center" className={classes.grid}>
        <Box>
          {!isLoading && (
            <Detail>
              Viser {elements} av {totalElements} {elementsName}
            </Detail>
          )}
        </Box>
      </HGrid>
    </Box>
  )
}
