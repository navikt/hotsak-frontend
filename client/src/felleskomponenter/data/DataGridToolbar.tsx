import { Box, Detail, HGrid, type BoxProps } from '@navikt/ds-react'

import { type Pageable } from '../Page'
import classes from './DataGridToolbar.module.css'

export interface DataGridToolbarProps extends Partial<Pageable> {
  elements?: number
  elementsName: string
  isLoading?: boolean
  padding?: BoxProps['padding']
  paddingBlock?: BoxProps['paddingBlock']
  paddingInline?: BoxProps['paddingInline']
}

export function DataGridToolbar(props: DataGridToolbarProps) {
  const {
    elements = 0,
    elementsName,
    totalElements = 0,
    isLoading,
    padding = 'space-8',
    paddingBlock,
    paddingInline,
  } = props
  return (
    <Box
      borderColor="neutral-subtleA"
      borderWidth="0 0 2 0"
      padding={padding}
      paddingBlock={paddingBlock}
      paddingInline={paddingInline}
    >
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
