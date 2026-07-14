import { Box, BoxProps } from '@navikt/ds-react'
import { type ReactNode } from 'react'
import classes from './ScrollablePanel.module.css'

interface ScrollablePanelProps {
  children: ReactNode
  paddingBlock?: BoxProps['paddingBlock']
  paddingInline?: BoxProps['paddingInline']
  'aria-label'?: string
}

export function ScrollablePanel({
  children,
  paddingBlock = 'space-0',
  paddingInline = 'space-0',
  'aria-label': ariaLabel,
}: ScrollablePanelProps) {
  return (
    <Box
      className={classes.root}
      paddingBlock={paddingBlock}
      paddingInline={paddingInline}
      tabIndex={0}
      role="region"
      aria-label={ariaLabel}
    >
      {children}
    </Box>
  )
}
