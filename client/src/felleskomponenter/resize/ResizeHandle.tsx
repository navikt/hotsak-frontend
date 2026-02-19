import { CaretLeftRightIcon, CaretUpDownIcon } from '@navikt/aksel-icons'
import { VStack } from '@navikt/ds-react'
import { Separator } from 'react-resizable-panels'
import classes from './ResizeHandle.module.css'

export const ResizeHandle = ({ retning = 'horisontal' }: { retning?: 'horisontal' | 'vertikal' }) => {
  return (
    <Separator className={classes.resizeHandle}>
      <VStack>{retning === 'horisontal' ? <CaretLeftRightIcon /> : <CaretUpDownIcon />}</VStack>
    </Separator>
  )
}
