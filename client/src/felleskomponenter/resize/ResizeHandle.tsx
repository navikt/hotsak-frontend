import { CaretLeftRightIcon, CaretUpDownIcon } from '@navikt/aksel-icons'
import { VStack } from '@navikt/ds-react'
import { PanelResizeHandle } from 'react-resizable-panels'
import classes from './ResizeHandle.module.css'

export const ResizeHandle = ({ retning = 'horisontal' }: { retning?: 'horisontal' | 'vertikal' }) => {
  return (
    <PanelResizeHandle className={classes.resizeHandle}>
      <VStack>{retning === 'horisontal' ? <CaretLeftRightIcon /> : <CaretUpDownIcon />}</VStack>
    </PanelResizeHandle>
  )
}
