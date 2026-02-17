import { Box, BoxProps } from '@navikt/ds-react'
import { type ReactNode } from 'react'
import classes from './ScrollablePanel.module.css'

interface ScrollablePanelProps {
  children: ReactNode
  paddingBlock?: BoxProps['paddingBlock']
  paddingInline?: BoxProps['paddingInline']
}

export function ScrollablePanel({ children, paddingBlock = '0', paddingInline = '0' }: ScrollablePanelProps) {
  return (
    <Box.New className={classes.root} paddingBlock={paddingBlock} paddingInline={paddingInline}>
      {children}
    </Box.New>
  )
}
