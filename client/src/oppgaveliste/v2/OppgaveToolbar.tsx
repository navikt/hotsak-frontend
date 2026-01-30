import { BodyShort, Box, HGrid, HStack } from '@navikt/ds-react'
import { type ReactNode } from 'react'

import { OppgaveColumnMenu } from './OppgaveColumnMenu.tsx'

export interface OppgaveToolbarProps {
  text: string
  children?: ReactNode
}

export function OppgaveToolbar(props: OppgaveToolbarProps) {
  const { text, children } = props
  return (
    <Box.New borderColor="neutral-subtleA" borderWidth="0 0 2 0" padding="2">
      <HGrid columns="1fr 1fr 1fr">
        <div />
        <BodyShort align="center" size="small">
          {text}
        </BodyShort>
        <HStack gap="2" justify="end">
          {children}
          <OppgaveColumnMenu />
        </HStack>
      </HGrid>
    </Box.New>
  )
}
