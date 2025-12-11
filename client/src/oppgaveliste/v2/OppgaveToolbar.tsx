import { BodyShort, Box, HStack } from '@navikt/ds-react'

import { OppgaveColumnMenu } from './OppgaveColumnMenu.tsx'

export interface OppgaveToolbarProps {
  text: string
}

export function OppgaveToolbar(props: OppgaveToolbarProps) {
  const { text } = props
  return (
    <Box.New borderColor="neutral-subtleA" borderWidth="0 0 2 0" padding="2">
      <HStack align="end" justify="space-between">
        <div />
        <BodyShort>{text}</BodyShort>
        <OppgaveColumnMenu />
      </HStack>
    </Box.New>
  )
}
