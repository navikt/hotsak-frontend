import { Box, HStack } from '@navikt/ds-react'

import { OppgaveColumnMenu } from './OppgaveColumnMenu.tsx'

export interface OppgaveToolbarProps {}

export function OppgaveToolbar(props: OppgaveToolbarProps) {
  const {} = props
  return (
    <Box.New borderColor="neutral-subtleA" borderWidth="0 0 2 0" padding="2">
      <HStack align="center" justify="space-between">
        <div />
        <OppgaveColumnMenu />
      </HStack>
    </Box.New>
  )
}
