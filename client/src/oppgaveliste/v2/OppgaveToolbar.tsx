import { BodyShort, Box, HGrid, HStack } from '@navikt/ds-react'
import { type ReactNode } from 'react'

import { OppgaveColumnMenu } from './OppgaveColumnMenu.tsx'

import classes from './OppgaveToolbar.module.css'

export interface OppgaveToolbarProps {
  text: string
  children?: ReactNode
}

export function OppgaveToolbar(props: OppgaveToolbarProps) {
  const { text, children } = props
  return (
    <Box.New borderColor="neutral-subtleA" borderWidth="0 0 2 0" className={classes.root} padding="2">
      <HGrid columns="1fr 1fr 1fr" align="center" className={classes.grid}>
        <div />
        <BodyShort align="center" size="small">
          {text}
        </BodyShort>
        <HStack gap="2" justify="end" align="center">
          {children}
          <OppgaveColumnMenu />
        </HStack>
      </HGrid>
    </Box.New>
  )
}
